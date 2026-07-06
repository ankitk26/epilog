import type { Id } from "../_generated/dataModel";
import { internalMutation } from "../_generated/server";
import { mergeMediaReferences } from "./_helpers";

// ─────────────────────────────────────────────
// Standardize source IDs and separate manga from
// books for old pre-migration data.
// ─────────────────────────────────────────────

type MediaDoc = {
	_id: Id<"media">;
	_creationTime: number;
	type: string;
	sourceMediaId: string;
};

type MigrationTarget = {
	mediaId: Id<"media">;
	newType: string;
	newSourceMediaId: string;
};

function computeMigrationTarget(doc: MediaDoc): MigrationTarget | null {
	// Idempotency: skip docs already migrated (new format contains ":").
	if (doc.sourceMediaId.includes(":")) {
		return null;
	}

	if (doc.type === "movie") {
		return {
			mediaId: doc._id,
			newType: "movie",
			newSourceMediaId: `tmdb:movie:${doc.sourceMediaId}`,
		};
	}

	if (doc.type === "tv") {
		return {
			mediaId: doc._id,
			newType: "tv",
			newSourceMediaId: `tmdb:tv:${doc.sourceMediaId}`,
		};
	}

	if (doc.type === "anime") {
		return {
			mediaId: doc._id,
			newType: "anime",
			newSourceMediaId: `mal:anime:${doc.sourceMediaId}`,
		};
	}

	if (doc.type === "book") {
		// Manga from the MAL search had a "manga-" prefix.
		if (doc.sourceMediaId.startsWith("manga-")) {
			const nativeId = doc.sourceMediaId.slice("manga-".length);
			return {
				mediaId: doc._id,
				newType: "manga",
				newSourceMediaId: `mal:manga:${nativeId}`,
			};
		}

		// Manga added via OpenLibrary search have purely numeric IDs.
		// Real books have "/works/" in the key or non-numeric IDs
		// (e.g. wrOQLV6xB-wC, OL26594474M).
		if (/^\d+$/.test(doc.sourceMediaId)) {
			return {
				mediaId: doc._id,
				newType: "manga",
				newSourceMediaId: `ol:manga:${doc.sourceMediaId}`,
			};
		}

		return {
			mediaId: doc._id,
			newType: "book",
			newSourceMediaId: `ol:book:${doc.sourceMediaId}`,
		};
	}

	// Unknown type — leave untouched.
	return null;
}

export const separateMangaAndStandardizeSourceIds = internalMutation({
	args: {},
	handler: async (ctx) => {
		const allMedia = await ctx.db.query("media").collect();

		let skippedAlreadyMigrated = 0;
		let skippedUnknown = 0;

		// Group by new sourceMediaId to detect collisions (multiple old docs
		// collapsing onto the same new dedup key).
		const groupsByNewId = new Map<
			string,
			Array<{ doc: MediaDoc; target: MigrationTarget }>
		>();

		for (const doc of allMedia) {
			const target = computeMigrationTarget(doc);
			if (!target) {
				if (doc.sourceMediaId.includes(":")) {
					skippedAlreadyMigrated++;
				} else {
					skippedUnknown++;
				}
				continue;
			}
			const bucket = groupsByNewId.get(target.newSourceMediaId) ?? [];
			bucket.push({ doc, target });
			groupsByNewId.set(target.newSourceMediaId, bucket);
		}

		let mergedDuplicates = 0;
		let patched = 0;
		const migratedTypes: Record<string, number> = {};

		for (const [, group] of groupsByNewId) {
			// Canonical = earliest created doc.
			group.sort((a, b) => a.doc._creationTime - b.doc._creationTime);
			const canonical = group[0];
			const duplicates = group.slice(1);

			// Merge each duplicate into the canonical media row.
			for (const { doc: duplicate } of duplicates) {
				await mergeMediaReferences(
					ctx,
					duplicate._id,
					canonical.doc._id,
				);
				await ctx.db.delete(duplicate._id);
				mergedDuplicates++;
			}

			// Patch the canonical doc with the new type + sourceMediaId.
			await ctx.db.patch(canonical.doc._id, {
				type: canonical.target.newType as
					| "anime"
					| "movie"
					| "tv"
					| "book"
					| "manga",
				sourceMediaId: canonical.target.newSourceMediaId,
			});
			patched++;
			migratedTypes[canonical.target.newType] =
				(migratedTypes[canonical.target.newType] ?? 0) + 1;
		}

		return {
			patched,
			mergedDuplicates,
			skippedAlreadyMigrated,
			skippedUnknown,
			migratedTypes,
		};
	},
});
