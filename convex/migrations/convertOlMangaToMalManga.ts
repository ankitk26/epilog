import { v } from "convex/values";
import { internal } from "../_generated/api";
import { internalAction } from "../_generated/server";

// ─────────────────────────────────────────────
// Convert incorrectly classified ol:manga records
// to mal:manga by searching MyAnimeList for the title.
//
// Each invocation handles one batch, then schedules
// the next invocation to respect MyAnimeList rate limits.
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
		// MyAnimeList API: conservative rate-limiting.
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
				// Respect MyAnimeList API rate limit.
				await new Promise((resolve) =>
					setTimeout(resolve, requestGapMs),
				);

				const clientId = process.env.MAL_CLIENT_ID;
				if (!clientId) {
					throw new Error("MAL_CLIENT_ID is not configured");
				}

				const searchParams = new URLSearchParams({
					q: media.name,
					limit: "1",
					fields: "id,title,alternative_titles,main_picture,nsfw",
				});

				const response = await fetch(
					`https://api.myanimelist.net/v2/manga?${searchParams.toString()}`,
					{
						headers: { "X-MAL-CLIENT-ID": clientId },
					},
				);

				if (!response.ok) {
					throw new Error(
						`MyAnimeList search returned ${response.status}`,
					);
				}

				const data = (await response.json()) as {
					data?: Array<{
						node: {
							id: number;
							title: string;
							alternative_titles?: { en?: string | null } | null;
							main_picture?: { large?: string } | null;
							nsfw?: "white" | "gray" | "black";
						};
					}>;
				};
				const match = data.data?.[0]?.node;

				if (!match || match.nsfw === "black") {
					failed.push({
						id: media._id,
						name: media.name,
						reason: "no MyAnimeList match",
					});
					continue;
				}

				const newSourceMediaId = `mal:manga:${match.id}`;
				const newName = match.alternative_titles?.en ?? match.title;

				const result = await ctx.runMutation(
					internal.migrations._mutations.updateOlMangaToMal,
					{
						mediaId: media._id,
						newSourceMediaId,
						newName,
						newImage: match.main_picture?.large ?? media.image,
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
