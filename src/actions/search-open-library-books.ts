import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import { type BookSearchOutput, openLibraryBookSearchAPIOutput } from "@/types";

const collectionPatterns =
	/\b(box\s*set|collection|omnibus|volumes?|books?\s+1[-–]|complete\s+series|the\s+\d+\s+books)\b/i;

const latinTextPattern = /\p{Script=Latin}/u;

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

export const searchOpenLibraryBooks = createServerFn({ method: "GET" })
	.inputValidator((data: { searchQuery: string }) => data)
	.handler(async ({ data }) => {
		const { data: books, error } = await betterFetch(
			"https://openlibrary.org/search.json",
			{
				method: "GET",
				query: {
					q: `${data.searchQuery}`,
					language: "eng",
					limit: "20",
					fields: "key,title,author_name,author_alternative_name,cover_i,first_publish_year,series_key,series_name,series_position,editions,editions.key,editions.title,editions.cover_i,editions.language",
				},
				output: openLibraryBookSearchAPIOutput,
			},
		);

		if (error || !books) {
			console.error("OpenLibrary API error:", error);
			return { data: [] } satisfies BookSearchOutput;
		}

		const results = books.docs
			.filter((book) => {
				const position = book.series_position?.[0] ?? "";
				const looksLikeCollection =
					collectionPatterns.test(book.title) ||
					/^\d+[-–]\d+$/.test(position);
				return !looksLikeCollection;
			})
			.map((book) => {
				const englishEdition = book.editions?.docs.find((edition) =>
					edition.language?.includes("eng"),
				);
				const coverId = englishEdition?.cover_i ?? book.cover_i;
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
					title: englishEdition?.title ?? book.title,
					author: getAuthorName(book),
					imageUrl,
					publishYear: book.first_publish_year ?? null,
					seriesName,
					seriesPosition,
					seriesTotal: null,
					seriesKey,
				};
			});

		return { data: results } satisfies BookSearchOutput;
	});
