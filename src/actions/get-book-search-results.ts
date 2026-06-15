import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { type BookSearchOutput, openLibraryBookSearchAPIOutput } from "@/types";

export const getBookSearchResults = createServerFn({ method: "GET" })
	.inputValidator(z.object({ searchQuery: z.string() }))
	.handler(async ({ data }) => {
		const { data: books, error } = await betterFetch(
			"https://openlibrary.org/search.json",
			{
				method: "GET",
				query: {
					q: `${data.searchQuery} language:eng`,
					lang: "en",
					limit: "25",
					fields: "key,title,author_name,cover_i,first_publish_year,series_key,series_name,series_position,editions,editions.key,editions.title,editions.cover_i,editions.language,editions.publish_year",
				},
				output: openLibraryBookSearchAPIOutput,
			},
		);

		if (error) {
			console.error("OpenLibrary API error:", error);
			return { data: [] } as BookSearchOutput;
		}

		// Collect unique series keys to fetch total counts
		const seriesKeys = new Set<string>();
		for (const book of books.docs) {
			if (book.series_key?.[0]) {
				seriesKeys.add(book.series_key[0]);
			}
		}

		// Fetch total counts for each series
		const seriesTotals = new Map<string, number>();
		for (const seriesKey of seriesKeys) {
			try {
				const { data: seriesBooks } = await betterFetch(
					"https://openlibrary.org/search.json",
					{
						method: "GET",
						query: {
							q: `series_key:${seriesKey}`,
							fields: "series_position",
							limit: "50",
						},
						output: z.object({
							numFound: z.number(),
							docs: z.array(
								z.object({
									series_position: z
										.array(z.string())
										.optional(),
								}),
							),
						}),
					},
				);

				// Count only individual books (filter out box sets like "1-7")
				const total =
					seriesBooks?.docs.filter((doc) => {
						const pos = doc.series_position?.[0];
						return pos && /^\d+$/.test(pos);
					}).length ?? 0;

				seriesTotals.set(seriesKey, total);
			} catch (e) {
				console.error(
					`Failed to fetch series total for ${seriesKey}:`,
					e,
				);
			}
		}

		const results = books.docs.map((book) => {
			const englishEdition = book.editions?.docs.find((edition) =>
				edition.language?.includes("eng"),
			);
			const coverId = englishEdition?.cover_i ?? book.cover_i;
			const imageUrl = coverId
				? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
				: null;

			const seriesKey = book.series_key?.[0];
			const seriesName = book.series_name?.[0];
			const seriesPositionStr = book.series_position?.[0];
			const seriesPosition =
				seriesPositionStr && /^\d+$/.test(seriesPositionStr)
					? parseInt(seriesPositionStr, 10)
					: null;
			const seriesTotal = seriesKey
				? (seriesTotals.get(seriesKey) ?? null)
				: null;

			let title = englishEdition?.title ?? book.title;

			// Append series info to title if available
			if (
				seriesPosition &&
				seriesTotal &&
				seriesTotal > 1 &&
				seriesName
			) {
				title = `${title} (${seriesName}, #${seriesPosition} of ${seriesTotal})`;
			}

			return {
				id: book.key,
				title,
				author: book.author_name?.[0] ?? null,
				imageUrl,
				publishYear: book.first_publish_year ?? null,
				seriesName: seriesName ?? null,
				seriesPosition,
				seriesTotal,
				seriesKey: seriesKey ?? null,
			};
		});

		// Sort results so books from the same series appear together
		results.sort((a, b) => {
			const aHasSeries = a.seriesKey && a.seriesPosition;
			const bHasSeries = b.seriesKey && b.seriesPosition;

			if (aHasSeries && bHasSeries) {
				if (a.seriesKey === b.seriesKey) {
					// Same series: sort by position
					return (a.seriesPosition ?? 0) - (b.seriesPosition ?? 0);
				}
				// Different series: sort by series key to keep each series together
				return a.seriesKey!.localeCompare(b.seriesKey!);
			}

			if (aHasSeries) return -1;
			if (bHasSeries) return 1;
			return 0;
		});

		return {
			data: results,
		} satisfies BookSearchOutput;
	});
