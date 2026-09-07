import { v } from "convex/values";
import { z } from "zod";
import { internal } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
import { internalAction } from "../_generated/server";

// ─────────────────────────────────────────────
// Re-fetch the latest OpenLibrary edition cover
// for all book media entries and update their image.
// Matches the search logic: prefer the latest English
// edition with a cover, fall back to the latest overall
// edition with a cover if none are English.
// Each invocation handles one batch, then schedules the next.
// ─────────────────────────────────────────────

const openLibraryEditionsAPIOutput = z.object({
	entries: z.array(
		z.object({
			key: z.string(),
			title: z.string().optional(),
			subtitle: z.string().optional(),
			covers: z.array(z.number()).optional(),
			publish_date: z.string().optional(),
			languages: z.array(z.object({ key: z.string() })).optional(),
			physical_format: z.string().optional(),
			edition_name: z.string().optional(),
		}),
	),
});

function extractYear(publishDate: string | undefined): number | null {
	if (!publishDate) return null;
	const match = publishDate.match(/\d{4}/);
	return match ? parseInt(match[0], 10) : null;
}

const specialEditionPatterns =
	/\b(audiobook|audio\s*cd|eaudiobook|deluxe|collector'?s|limited|special|signed|annotated|boxed\s*set|omnibus|library\s*binding|graphic\s*novel|comic|manga)\b/i;

function isStandardEdition(entry: {
	title?: string;
	subtitle?: string;
	physical_format?: string;
	edition_name?: string;
}): boolean {
	const text = `${entry.title ?? ""} ${entry.subtitle ?? ""} ${entry.physical_format ?? ""} ${entry.edition_name ?? ""}`;

	if (specialEditionPatterns.test(text)) {
		return false;
	}

	return true;
}

async function fetchLatestCoverId(workId: string): Promise<number | null> {
	const editionInfo = await fetchLatestEditionInfo(workId);
	return editionInfo.coverId;
}

async function fetchLatestEditionInfo(workId: string): Promise<{
	title: string | null;
	coverId: number | null;
}> {
	const response = await fetch(
		`https://openlibrary.org/works/${workId}/editions.json?sort=published&limit=50`,
	);

	if (!response.ok) {
		throw new Error(`OpenLibrary returned ${response.status}`);
	}

	const parsed = openLibraryEditionsAPIOutput.safeParse(
		await response.json(),
	);
	if (!parsed.success) {
		throw new Error(
			`Invalid OpenLibrary response: ${parsed.error.message}`,
		);
	}

	const editionsWithYear = parsed.data.entries
		.map((entry) => ({
			...entry,
			year: extractYear(entry.publish_date),
			isEnglish: entry.languages?.some(
				(language) => language.key === "/languages/eng",
			),
		}))
		.filter((entry) => entry.year != null);

	if (editionsWithYear.length === 0) {
		return { title: null, coverId: null };
	}

	const englishEditions = editionsWithYear.filter((entry) => entry.isEnglish);
	const hasEnglishEdition = englishEditions.length > 0;

	const standardEnglishEditions = hasEnglishEdition
		? englishEditions.filter(isStandardEdition)
		: [];
	const standardEditions = editionsWithYear.filter(isStandardEdition);

	const titleCandidates =
		standardEnglishEditions.length > 0
			? standardEnglishEditions
			: hasEnglishEdition
				? englishEditions
				: editionsWithYear;
	const title = titleCandidates.sort(
		(a, b) => (b.year ?? 0) - (a.year ?? 0),
	)[0]?.title;

	const coverCandidates =
		standardEnglishEditions.length > 0
			? standardEnglishEditions.filter(
					(entry) => entry.covers != null && entry.covers.length > 0,
				)
			: standardEditions.length > 0
				? standardEditions.filter(
						(entry) =>
							entry.covers != null && entry.covers.length > 0,
					)
				: hasEnglishEdition
					? englishEditions.filter(
							(entry) =>
								entry.covers != null && entry.covers.length > 0,
						)
					: editionsWithYear.filter(
							(entry) =>
								entry.covers != null && entry.covers.length > 0,
						);

	if (coverCandidates.length === 0) {
		return { title: title ?? null, coverId: null };
	}

	const latest = coverCandidates.sort(
		(a, b) => (b.year ?? 0) - (a.year ?? 0),
	)[0];
	return { title: title ?? null, coverId: latest.covers?.[0] ?? null };
}

export const updateBookCovers = internalAction({
	args: {
		cursor: v.optional(v.id("media")),
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
		const batchSize = Math.min(args.batchSize ?? 10, 20);
		const nextBatchDelayMs = 1000;
		const requestDelayMs = 200;

		const { media, nextCursor } = await ctx.runQuery(
			internal.migrations._queries.getBookMedia,
			{ cursor: args.cursor, limit: batchSize },
		);

		let updated = 0;
		let failed = 0;
		let skipped = 0;

		for (const item of media) {
			const workIdPart = item.sourceMediaId.slice("ol:book:".length);
			const workId = workIdPart.startsWith("/works/")
				? workIdPart.slice("/works/".length)
				: workIdPart;

			if (!workId) {
				console.log(
					`[updateBookCovers] skipping ${item._id}: no work id`,
				);
				skipped++;
				continue;
			}

			await new Promise((resolve) => setTimeout(resolve, requestDelayMs));

			try {
				const coverId = await fetchLatestCoverId(workId);

				if (!coverId) {
					console.log(
						`[updateBookCovers] ${item._id}: no cover found`,
					);
					skipped++;
					continue;
				}

				const imageUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;

				await ctx.runMutation(
					internal.migrations._mutations.updateMediaImage,
					{ mediaId: item._id, image: imageUrl },
				);

				console.log(`[updateBookCovers] ${item._id}: ${imageUrl}`);
				updated++;
			} catch (error) {
				console.error(`[updateBookCovers] ${item._id}: failed`, error);
				failed++;
			}
		}

		if (nextCursor) {
			await ctx.scheduler.runAfter(
				nextBatchDelayMs,
				internal.migrations.updateBookCovers.updateBookCovers,
				{ cursor: nextCursor, batchSize },
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
