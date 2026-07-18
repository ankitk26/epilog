import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { type BookSearchOutput, openLibraryBookSearchAPIOutput } from "@/types";

const collectionPatterns =
	/\b(box\s*set|collection|omnibus|volumes?|books?\s+1[-–]|complete\s+series|the\s+\d+\s+books)\b/i;

const latinTextPattern = /\p{Script=Latin}/u;

const SEARCH_LIMIT = 20;
const SERIES_SEARCH_LIMIT = 10;
const MAX_SERIES_EXPANSIONS = 3;
const EDITIONS_CONCURRENCY = 5;

const openLibrarySearchFields = [
	"key",
	"title",
	"author_name",
	"author_alternative_name",
	"cover_i",
	"first_publish_year",
	"series_key",
	"series_name",
	"series_position",
	"editions",
	"editions.key",
	"editions.title",
	"editions.cover_i",
	"editions.language",
	"editions.publish_year",
];

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

type OpenLibraryBookDoc = {
	key: string;
	title: string;
	author_name?: string[];
	author_alternative_name?: string[];
	cover_i?: number;
	first_publish_year?: number;
	series_key?: string[];
	series_name?: string[];
	series_position?: string[];
	editions?: {
		docs: Array<{
			key?: string;
			title?: string;
			cover_i?: number;
			language?: string[];
			publish_year?: number[];
		}>;
	};
};

function getAuthorName(book: {
	author_alternative_name?: string[];
	author_name?: string[];
}) {
	const primaryName = book.author_name?.[0];

	if (primaryName && latinTextPattern.test(primaryName)) {
		return primaryName;
	}

	const latinAlternatives =
		book.author_alternative_name?.filter((name) =>
			latinTextPattern.test(name),
		) ?? [];

	// Prefer the natural "FirstName LastName" format (no comma) over
	// the inverted "LastName, FirstName" format that OpenLibrary returns.
	const naturalName = latinAlternatives.find((name) => !name.includes(","));
	if (naturalName) {
		return naturalName;
	}

	// Fall back to first Latin alternative even if comma-formatted.
	if (latinAlternatives.length > 0) {
		return latinAlternatives[0];
	}

	return primaryName ?? null;
}

function looksLikeCollection(book: OpenLibraryBookDoc) {
	const position = book.series_position?.[0] ?? "";
	return collectionPatterns.test(book.title) || /^\d+[-–]\d+$/.test(position);
}

function getSearchEditionTitle(book: OpenLibraryBookDoc): string | null {
	const englishEditions =
		book.editions?.docs.filter((edition) =>
			edition.language?.includes("eng"),
		) ?? [];

	const latestEnglish = englishEditions.sort((a, b) => {
		const yearA = a.publish_year?.[0] ?? 0;
		const yearB = b.publish_year?.[0] ?? 0;
		return yearB - yearA;
	})[0];

	return latestEnglish?.title ?? null;
}

function getSearchEditionCoverId(book: OpenLibraryBookDoc): number | null {
	const editions = book.editions?.docs ?? [];
	if (editions.length === 0) {
		return book.cover_i ?? null;
	}

	const editionsByYear = [...editions].sort((a, b) => {
		const yearA = a.publish_year?.[0] ?? 0;
		const yearB = b.publish_year?.[0] ?? 0;
		return yearB - yearA;
	});

	const englishEditions = editionsByYear.filter((edition) =>
		edition.language?.includes("eng"),
	);
	const candidateEditions =
		englishEditions.length > 0 ? englishEditions : editionsByYear;

	const latestWithCover = candidateEditions.find(
		(edition) => edition.cover_i,
	);
	return latestWithCover?.cover_i ?? book.cover_i ?? null;
}

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

async function runWithConcurrency<T, R>(
	items: T[],
	concurrency: number,
	fn: (item: T) => Promise<R>,
): Promise<R[]> {
	const results: R[] = new Array<R>(items.length);
	let index = 0;

	async function worker() {
		while (index < items.length) {
			const currentIndex = index++;
			results[currentIndex] = await fn(items[currentIndex]);
		}
	}

	const workers = Array.from({ length: concurrency }, () => worker());
	await Promise.all(workers);
	return results;
}

async function fetchWorkLatestEditionInfo(workId: string): Promise<{
	title: string | null;
	coverId: number | null;
}> {
	const { data, error } = await betterFetch(
		`https://openlibrary.org/works/${workId}/editions.json`,
		{
			method: "GET",
			query: {
				sort: "published",
				limit: "50",
			},
			output: openLibraryEditionsAPIOutput,
		},
	);

	if (error || !data) {
		console.error(`OpenLibrary editions API error for ${workId}:`, error);
		return { title: null, coverId: null };
	}

	const editionsWithYear = data.entries
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

	const coverId =
		coverCandidates.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))[0]
			?.covers?.[0] ?? null;

	return { title: title ?? null, coverId };
}

function mapOpenLibraryBook(book: OpenLibraryBookDoc) {
	const coverId = getSearchEditionCoverId(book);
	const imageUrl = coverId
		? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
		: null;

	const seriesKey = book.series_key?.[0] ?? null;
	const seriesName = book.series_name?.[0] ?? null;
	const positionStr = book.series_position?.[0];
	const seriesPosition =
		positionStr && /^\d+$/.test(positionStr)
			? parseInt(positionStr, 10)
			: null;

	return {
		id: book.key.replace(/^\/works\//, ""),
		title: getSearchEditionTitle(book) ?? book.title,
		author: getAuthorName(book),
		imageUrl,
		publishYear: book.first_publish_year ?? null,
		seriesName,
		seriesPosition,
		seriesTotal: null,
		seriesKey,
	};
}

async function fetchOpenLibrarySearch(query: string) {
	const { data, error } = await betterFetch(
		"https://openlibrary.org/search.json",
		{
			method: "GET",
			query: {
				q: query,
				language: "eng",
				limit: String(SEARCH_LIMIT),
				fields: openLibrarySearchFields.join(","),
			},
			output: openLibraryBookSearchAPIOutput,
		},
	);

	if (error || !data) {
		console.error("OpenLibrary API error:", error);
		return null;
	}

	return data;
}

export const searchOpenLibraryBooks = createServerFn({ method: "GET" })
	.inputValidator((data: { searchQuery: string }) => data)
	.handler(async ({ data }) => {
		const initialSearch = await fetchOpenLibrarySearch(data.searchQuery);
		if (!initialSearch) {
			return { data: [] } satisfies BookSearchOutput;
		}

		const initialBooks = initialSearch.docs.filter(
			(book) => !looksLikeCollection(book),
		);
		const directResults = initialBooks.map(mapOpenLibraryBook);
		const directResultIds = new Set(
			directResults.map((result) => result.id),
		);

		const seriesNames = new Set<string>();
		const seriesToExpand: string[] = [];
		for (const book of initialBooks) {
			const name = book.series_name?.[0];
			if (name && !seriesNames.has(name)) {
				seriesNames.add(name);
				seriesToExpand.push(name);
			}
			if (seriesToExpand.length >= MAX_SERIES_EXPANSIONS) {
				break;
			}
		}

		const seriesResults: ReturnType<typeof mapOpenLibraryBook>[] = [];
		if (seriesToExpand.length > 0) {
			const seriesSearches = await Promise.all(
				seriesToExpand.map((seriesName) =>
					fetchOpenLibrarySearch(
						`series:"${seriesName.replace(/"/g, '\\"')}"`,
					),
				),
			);

			for (const seriesSearch of seriesSearches) {
				if (!seriesSearch) continue;

				const seriesBooks = seriesSearch.docs
					.filter((book) => !looksLikeCollection(book))
					.map(mapOpenLibraryBook)
					.filter((book) => !directResultIds.has(book.id));

				seriesResults.push(...seriesBooks);
			}
		}

		seriesResults.sort((a, b) => {
			if (a.seriesName && b.seriesName && a.seriesName === b.seriesName) {
				return (
					(a.seriesPosition ?? Infinity) -
					(b.seriesPosition ?? Infinity)
				);
			}
			return 0;
		});

		const results = seriesResults.slice(0, SERIES_SEARCH_LIMIT);
		const allResults = [...directResults, ...results];

		const resultsWithLatestEditionInfo = await runWithConcurrency(
			allResults,
			EDITIONS_CONCURRENCY,
			async (book) => {
				const { title, coverId } = await fetchWorkLatestEditionInfo(
					book.id,
				);

				const updates: Partial<typeof book> = {};
				if (title) updates.title = title;
				if (coverId) {
					updates.imageUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
				}

				return { ...book, ...updates };
			},
		);

		return {
			data: resultsWithLatestEditionInfo,
		} satisfies BookSearchOutput;
	});
