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
	"editions.title",
	"editions.cover_i",
	"editions.language",
];

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
			title?: string;
			cover_i?: number;
			language?: string[];
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
	const firstEnglishEdition = book.editions?.docs.find((edition) =>
		edition.language?.includes("eng"),
	);

	return firstEnglishEdition?.title ?? null;
}

function getSearchEditionCoverId(book: OpenLibraryBookDoc): number | null {
	const firstEnglishEdition = book.editions?.docs.find((edition) =>
		edition.language?.includes("eng"),
	);

	return firstEnglishEdition?.cover_i ?? book.cover_i ?? null;
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

		return {
			data: allResults,
		} satisfies BookSearchOutput;
	});
