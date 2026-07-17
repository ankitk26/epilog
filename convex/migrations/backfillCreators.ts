import { v } from "convex/values";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";
import { fetchCreatorForMedia, getRequestDelayMs } from "./_helpers";

// ─────────────────────────────────────────────
// Backfill creator metadata in small batches with
// per-API rate-limit delays. Each invocation
// handles one batch, then schedules the next.
// ─────────────────────────────────────────────

const mediaTypeLiteral = v.union(
	v.literal("anime"),
	v.literal("movie"),
	v.literal("tv"),
	v.literal("book"),
	v.literal("manga"),
);

export const backfillCreators = internalAction({
	args: {
		cursor: v.optional(v.id("media")),
		type: v.optional(mediaTypeLiteral),
		fromScratch: v.optional(v.boolean()),
		batchSize: v.optional(v.number()),
	},
	handler: async (
		ctx,
		args,
	): Promise<{
		processed: number;
		updated: number;
		failed: number;
		skipped: number;
		nextCursor: Id<"media"> | null;
		scheduledNext: boolean;
	}> => {
		// Per-API rate limits drive the delay between requests.
		// Batch size is capped so a single invocation stays inside Convex's
		// 30 s action timeout even for the slowest API (MyAnimeList).
		const batchSize = Math.min(args.batchSize ?? 10, 15);
		const nextBatchDelayMs = 3000;

		const { media, nextCursor } = await ctx.runQuery(
			internal.migrations._queries.getMediaWithoutCreator,
			{
				cursor: args.cursor,
				limit: batchSize,
				includeNull: args.fromScratch ? undefined : true,
				fromScratch: args.fromScratch,
				type: args.type,
			},
		);

		let updated = 0;
		let failed = 0;
		let skipped = 0;

		for (const item of media) {
			// Space requests apart based on the API being called.
			await new Promise((resolve) =>
				setTimeout(resolve, getRequestDelayMs(item.sourceMediaId)),
			);

			try {
				console.log(
					`[scheduled backfill] ${item._id} (${item.type}) ${item.sourceMediaId}`,
				);
				const creator = await fetchCreatorForMedia(item);

				if (creator === undefined) {
					console.log(`  -> skipped`);
					skipped++;
					continue;
				}

				console.log(
					`  -> ${creator === null ? "no creator" : creator}`,
				);

				await ctx.runMutation(
					internal.migrations._mutations.updateMediaCreator,
					{ mediaId: item._id, creator },
				);
				updated++;
			} catch (error) {
				console.error(`  -> failed:`, error);
				failed++;
			}
		}

		// Schedule the next batch if there's more work.
		if (nextCursor) {
			await ctx.scheduler.runAfter(
				nextBatchDelayMs,
				internal.migrations.backfillCreators.backfillCreators,
				{
					cursor: nextCursor,
					type: args.type,
					fromScratch: args.fromScratch,
					batchSize,
				},
			);
		}

		return {
			processed: media.length,
			updated,
			failed,
			skipped,
			nextCursor,
			scheduledNext: !!nextCursor,
		};
	},
});
