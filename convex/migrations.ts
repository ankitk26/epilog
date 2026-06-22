import type { Id } from "./_generated/dataModel";
import { type MutationCtx, mutation } from "./_generated/server";

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

export const separateMangaAndStandardizeSourceIds = mutation({
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

export const flipOlMangaToMangaType = mutation({
	args: {},
	handler: async (ctx) => {
		const allMedia = await ctx.db.query("media").collect();

		const flipped: Array<{ name: string; oldId: string; newId: string }> =
			[];
		const kept: Array<{ name: string; reason: string }> = [];

		for (const doc of allMedia) {
			if (doc.type !== "book") continue;
			if (!doc.sourceMediaId.startsWith("ol:book:")) continue;

			// Idempotency: already flipped.
			if (doc.sourceMediaId.startsWith("ol:manga:")) continue;

			const olId = doc.sourceMediaId.slice("ol:book:".length);

			// Real OpenLibrary books have /works/ in their work key.
			if (olId.includes("/works/")) {
				kept.push({ name: doc.name, reason: "has /works/" });
				continue;
			}

			// Manga IDs added via OpenLibrary are purely numeric.
			// Non-numeric IDs (e.g. wrOQLV6xB-wC, OL26594474M) are books.
			if (!/^\d+$/.test(olId)) {
				kept.push({ name: doc.name, reason: "non-numeric id" });
				continue;
			}

			// Purely numeric ol:book: id -> manga.
			const newSourceMediaId = `ol:manga:${olId}`;
			await ctx.db.patch(doc._id, {
				type: "manga",
				sourceMediaId: newSourceMediaId,
			});
			flipped.push({
				name: doc.name,
				oldId: doc.sourceMediaId,
				newId: newSourceMediaId,
			});
		}

		return {
			flippedCount: flipped.length,
			keptCount: kept.length,
			flipped,
			kept,
		};
	},
});

async function mergeMediaReferences(
	ctx: MutationCtx,
	fromMediaId: Id<"media">,
	toMediaId: Id<"media">,
) {
	// Repoint logs. If the canonical media already has a log for the same user,
	// drop the duplicate log to respect the one-log-per-user invariant.
	const duplicateLogs = await ctx.db
		.query("logs")
		.withIndex("by_media_and_status", (q) => q.eq("dbMediaId", fromMediaId))
		.collect();

	for (const log of duplicateLogs) {
		const existingCanonicalLog = await ctx.db
			.query("logs")
			.withIndex("by_user_and_mediaId", (q) =>
				q.eq("userId", log.userId).eq("dbMediaId", toMediaId),
			)
			.unique();

		if (existingCanonicalLog) {
			await ctx.db.delete(log._id);
		} else {
			await ctx.db.patch(log._id, { dbMediaId: toMediaId });
		}
	}

	// Repoint movieEvents. No index starts with dbMediaId, so a full scan
	// + in-memory filter is the only option (fine for a one-time migration
	// on a small table). If canonical already has an event for the same
	// user + date, drop the duplicate to respect the unique index.
	const allEvents = await ctx.db.query("movieEvents").collect();
	const duplicateEvents = allEvents.filter(
		(event) => event.dbMediaId === fromMediaId,
	);

	for (const event of duplicateEvents) {
		const existingCanonicalEvent = await ctx.db
			.query("movieEvents")
			.withIndex("by_user_and_mediaId_and_eventDate", (q) =>
				q
					.eq("userId", event.userId)
					.eq("dbMediaId", toMediaId)
					.eq("eventDate", event.eventDate),
			)
			.unique();

		if (existingCanonicalEvent) {
			await ctx.db.delete(event._id);
		} else {
			await ctx.db.patch(event._id, { dbMediaId: toMediaId });
		}
	}
}

// ─────────────────────────────────────────────
// Status migration: old 3-value enum → per-type statuses
// ─────────────────────────────────────────────

const oldToNewStatus: Record<string, Record<string, string>> = {
	book: { planned: "tbr", in_progress: "reading", completed: "finished" },
	manga: { planned: "tbr", in_progress: "reading", completed: "finished" },
	movie: {
		planned: "watchlist",
		in_progress: "watching",
		completed: "watched",
	},
	tv: {
		planned: "plan_to_watch",
		in_progress: "watching",
		completed: "completed",
	},
	anime: {
		planned: "plan_to_watch",
		in_progress: "watching",
		completed: "completed",
	},
};

export const migrateStatuses = mutation({
	args: {},
	handler: async (ctx) => {
		const allLogs = await ctx.db.query("logs").collect();

		let skipped = 0;
		let migrated = 0;
		const details: Array<{
			logId: string;
			old: string;
			new: string;
			type: string;
		}> = [];

		for (const log of allLogs) {
			const media = await ctx.db.get(log.dbMediaId);
			if (!media) {
				skipped++;
				continue;
			}

			const mapping = oldToNewStatus[media.type];
			if (!mapping) {
				skipped++;
				continue;
			}

			const newStatus = mapping[log.status];
			if (!newStatus) {
				// Already a new status or unknown old status
				skipped++;
				continue;
			}

			await ctx.db.patch(log._id, {
				status: newStatus as
					| "tbr"
					| "reading"
					| "finished"
					| "dnf"
					| "watchlist"
					| "watching"
					| "watched"
					| "plan_to_watch"
					| "waiting"
					| "completed"
					| "dropped",
			});
			migrated++;
			details.push({
				logId: log._id,
				old: log.status,
				new: newStatus,
				type: media.type,
			});
		}

		return { migrated, skipped, details };
	},
});
