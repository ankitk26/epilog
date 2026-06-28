import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import { type BookSearchOutput, openLibraryBookSearchAPIOutput } from "@/types";

const collectionPatterns =
	/\b(box\s*set|collection|omnibus|volumes?|books?\s+1[-–]|complete\s+series|the\s+\d+\s+books)\b/i;

export const searchOpenLibraryBooks = createServerFn({ method: "GET" })
	.inputValidator((data: { searchQuery: string }) => data)
	.handler(async ({ data }) => {
		const { data: books, error } = await betterFetch(
			"https://openlibrary.org/search.json",
			{
				method: "GET",
				query: {
					q: `${data.searchQuery} language:eng`,
					lang: "en",
					limit: "20",
					fields: "key,title,author_name,cover_i,first_publish_year,series_key,series_name,series_position,editions,editions.cover_i,editions.language",
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
				const englishEdition = book.editions?.docs.find(
					(edition) =>
						edition.language?.includes("eng") && edition.cover_i,
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
					id: book.key,
					title: book.title,
					author: book.author_name?.[0] ?? null,
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
