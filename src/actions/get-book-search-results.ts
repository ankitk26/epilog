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
					fields:
						"key,title,author_name,cover_i,first_publish_year,editions,editions.key,editions.title,editions.cover_i,editions.language",
				},
				output: openLibraryBookSearchAPIOutput,
			},
		);

		if (error) {
			console.error("OpenLibrary API error:", error);
			return { data: [] } as BookSearchOutput;
		}

		return {
			data: books.docs.map((book) => {
				const englishEdition = book.editions?.docs.find((edition) =>
					edition.language?.includes("eng"),
				);
				const coverId = englishEdition?.cover_i ?? book.cover_i;
				const imageUrl = coverId
					? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
					: null;

				return {
					id: book.key,
					title: englishEdition?.title ?? book.title,
					author: book.author_name?.[0] ?? null,
					imageUrl,
					publishYear: book.first_publish_year ?? null,
				};
			}),
		} satisfies BookSearchOutput;
	});
