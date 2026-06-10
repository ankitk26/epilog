import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { type BookSearchOutput, jikanMangaSearchAPIOutput } from "@/types";

export const getBookSearchResults = createServerFn({ method: "GET" })
	.inputValidator(z.object({ searchQuery: z.string() }))
	.handler(async ({ data }) => {
		const { data: books, error } = await betterFetch(
			"https://api.jikan.moe/v4/manga",
			{
				method: "GET",
				query: {
					q: data.searchQuery,
					limit: 25,
					sfw: true,
				},
				output: jikanMangaSearchAPIOutput,
			},
		);

		if (error) {
			console.error("Jikan API error:", error);
			return { data: [] } as BookSearchOutput;
		}

		return {
			data: books.data.map((book) => {
				let publishYear: number | null = null;
				if (book.published.from) {
					publishYear = new Date(book.published.from).getFullYear();
				}

				return {
					id: book.mal_id.toString(),
					title: book.title_english ?? book.title ?? "NA",
					author: null,
					imageUrl: book.images.webp?.large_image_url,
					publishYear,
				};
			}),
		} satisfies BookSearchOutput;
	});
