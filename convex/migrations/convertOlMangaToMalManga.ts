import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

// ─────────────────────────────────────────────
// Convert incorrectly classified ol:manga records
// to mal:manga by searching Jikan for the title.
//
// Each invocation handles one batch, then schedules
// the next invocation to respect Jikan rate limits.
// ─────────────────────────────────────────────

export const convertOlMangaToMalManga = internalAction({
	args: {
		limit: v.optional(v.number()),
	},
	handler: async (
		ctx,
		args,
	): Promise<{
		convertedCount: number;
		failedCount: number;
		processed: number;
		scheduledNext: boolean;
		converted: Array<{
			id: string;
			oldSourceMediaId: string;
			newSourceMediaId: string;
			oldName: string;
			newName: string;
			action: string;
		}>;
		failed: Array<{ id: string; name: string; reason: string }>;
	}> => {
		// Jikan: 3 requests/sec, 60 requests/min.
		// 10 items × 1.2 s = 12 s of delays + fetch time, under 30 s timeout.
		const batchSize = Math.min(args.limit ?? 10, 15);
		const requestGapMs = 1200;
		const nextBatchDelayMs = 3000;

		const records = await ctx.runQuery(
			internal.migrations._queries.getOlMangaRecords,
			{ limit: batchSize },
		);

		const converted: Array<{
			id: string;
			oldSourceMediaId: string;
			newSourceMediaId: string;
			oldName: string;
			newName: string;
			action: string;
		}> = [];
		const failed: Array<{ id: string; name: string; reason: string }> = [];

		for (const media of records) {
			try {
				// Respect Jikan rate limit (~3 req/s, 60 req/min).
				await new Promise((resolve) =>
					setTimeout(resolve, requestGapMs),
				);

				const response = await fetch(
					`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(
						media.name,
					)}&limit=1&sfw=true`,
				);

				if (!response.ok) {
					throw new Error(`Jikan search returned ${response.status}`);
				}

				const data = (await response.json()) as {
					data?: Array<{
						mal_id: number;
						title: string;
						title_english: string | null;
						images: {
							webp: {
								large_image_url: string;
							};
						};
					}>;
				};
				const match = data.data?.[0];

				if (!match) {
					failed.push({
						id: media._id,
						name: media.name,
						reason: "no Jikan match",
					});
					continue;
				}

				const newSourceMediaId = `mal:manga:${match.mal_id}`;
				const newName = match.title_english ?? match.title;

				const result = await ctx.runMutation(
					internal.migrations._mutations.updateOlMangaToMal,
					{
						mediaId: media._id,
						newSourceMediaId,
						newName,
						newImage:
							match.images?.webp?.large_image_url ?? media.image,
					},
				);

				converted.push({
					id: media._id,
					oldSourceMediaId: media.sourceMediaId,
					newSourceMediaId,
					oldName: media.name,
					newName,
					action: result.action,
				});
			} catch (error) {
				failed.push({
					id: media._id,
					name: media.name,
					reason: String(error),
				});
			}
		}

		const nextCursor =
			records.length === batchSize
				? records[records.length - 1]._id
				: null;

		if (nextCursor) {
			await ctx.scheduler.runAfter(
				nextBatchDelayMs,
				internal.migrations.convertOlMangaToMalManga
					.convertOlMangaToMalManga,
				{ limit: batchSize },
			);
		}

		return {
			convertedCount: converted.length,
			failedCount: failed.length,
			processed: records.length,
			scheduledNext: !!nextCursor,
			converted,
			failed,
		};
	},
});
