import { v } from "convex/values";
import { internal } from "../_generated/api";
import {
	internalAction,
	internalMutation,
	internalQuery,
} from "../_generated/server";
import { refreshMediaSnapshots } from "../lib/mediaSnapshots";

// ─────────────────────────────────────────────
// Resolves each book media doc's stored creator name to the OpenLibrary
// author record with the most works (name searches often surface stub or
// duplicate records) and stores it as media.bookAuthorId so logged books
// link to the author page. Idempotent: media docs that already carry a
// bookAuthorId are skipped. Run via `pnpm deploy:convex` chain or
// `convex run migrations/backfillMediaBookAuthorIds:backfillMediaBookAuthorIds '{}'`.
// ─────────────────────────────────────────────

const OPEN_LIBRARY_TIMEOUT_MS = 10_000;
const BATCH_SIZE = 5;

type PendingBookMedia = { id: string; creator: string | null };

async function resolveBookAuthorIdByCreatorName(
	creator: string,
): Promise<string | null> {
	const url = new URL("https://openlibrary.org/search/authors.json");
	url.searchParams.set("q", creator.replace(/["\\]/g, "").trim());
	url.searchParams.set("limit", "5");
	url.searchParams.set("fields", "key,work_count");

	const response = await fetch(url, {
		signal: AbortSignal.timeout(OPEN_LIBRARY_TIMEOUT_MS),
	});

	if (!response.ok) {
		return null;
	}

	// SAFETY: The Open Library search API returns a JSON payload where `docs`
	// is an array of author records with a string `key`; we only read optional
	// fields and treat missing/malformed data as an empty result.
	const data = (await response.json()) as {
		docs?: Array<{ key: string; work_count?: number }>;
	};

	const bestDoc = [...(data.docs ?? [])]
		.filter((doc) => (doc.work_count ?? 0) > 0)
		.sort((a, b) => (b.work_count ?? 0) - (a.work_count ?? 0))[0];

	return bestDoc?.key ?? null;
}

export const getPendingBookMedia = internalQuery({
	handler: async (ctx) => {
		const media = await ctx.db.query("media").collect();

		return media
			.filter(
				(doc): PendingBookMedia =>
					doc.type === "book" &&
					doc.bookAuthorId === undefined &&
					doc.creator != null,
			)
			.map((doc) => ({ id: doc._id, creator: doc.creator }));
	},
});

export const applyBookAuthorIds = internalMutation({
	args: {
		items: v.array(
			v.object({
				mediaId: v.id("media"),
				bookAuthorId: v.string(),
			}),
		),
	},
	handler: async (ctx, args) => {
		for (const { mediaId, bookAuthorId } of args.items) {
			const media = await ctx.db.get(mediaId);
			if (!media || media.bookAuthorId) {
				continue;
			}

			await ctx.db.patch(mediaId, { bookAuthorId });
			// Keep logs' denormalized snapshots in sync with the media doc.
			await refreshMediaSnapshots(ctx, { ...media, bookAuthorId });
		}
	},
});

export const backfillMediaBookAuthorIds = internalAction({
	args: {},
	handler: async (ctx) => {
		const pending = await ctx.runQuery(
			internal.migrations.backfillMediaBookAuthorIds.getPendingBookMedia,
			{},
		);

		let updated = 0;
		let unresolved = 0;

		for (let offset = 0; offset < pending.length; offset += BATCH_SIZE) {
			const batch = pending.slice(offset, offset + BATCH_SIZE);
			const items = (
				await Promise.all(
					batch.map(async ({ id, creator }) => {
						if (!creator) {
							return null;
						}

						const bookAuthorId =
							await resolveBookAuthorIdByCreatorName(creator);

						if (!bookAuthorId) {
							return null;
						}

						return { mediaId: id, bookAuthorId };
					}),
				)
			).flatMap((item) => (item ? [item] : []));

			if (items.length === 0) {
				continue;
			}

			await ctx.runMutation(
				internal.migrations.backfillMediaBookAuthorIds
					.applyBookAuthorIds,
				{ items },
			);
			updated += items.length;
		}

		unresolved = pending.length - updated;

		console.log(
			`[backfillMediaBookAuthorIds] updated=${updated} unresolved=${unresolved}`,
		);

		return { updated, unresolved };
	},
});
