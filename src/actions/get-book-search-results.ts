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
					q: data.searchQuery,
					limit: 25,
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
				const imageUrl = book.cover_i
					? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
					: null;

				return {
					id: book.key,
					title: book.title,
					author: book.author_name?.[0] ?? null,
					imageUrl,
					publishYear: book.first_publish_year ?? null,
				};
			}),
		} satisfies BookSearchOutput;
	});
