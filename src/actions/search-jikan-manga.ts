import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import {
	type JikanMangaSearchOutput,
	jikanMangaSearchAPIOutput,
} from "@/types";

export const searchJikanManga = createServerFn({ method: "GET" })
	.inputValidator(z.object({ searchQuery: z.string() }))
	.handler(async ({ data }) => {
		const { data: mangaContent, error } = await betterFetch(
			"https://api.jikan.moe/v4/manga",
			{
				method: "GET",
				query: {
					q: data.searchQuery,
					sfw: "true",
				},
				output: jikanMangaSearchAPIOutput,
			},
		);

		if (error) {
			console.error(error.message);
			return { data: [] } as JikanMangaSearchOutput;
		}

		return mangaContent;
	});
