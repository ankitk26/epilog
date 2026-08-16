import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { mediaSearchAPIOutput, mediaTypes } from "@/types";

const SEARCH_TIMEOUT_MS = 10_000;

export const searchTmdbMoviesAndTv = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			searchQuery: z.string(),
			mediaType: z.enum(mediaTypes),
		}),
	)
	.handler(async ({ data }) => {
		let searchType = "tv";
		if (data.mediaType === "movie") {
			searchType = "movie";
		}

		const TMDB_TOKEN = process.env.TMDB_TOKEN;

		const { data: mediaContent, error } = await betterFetch(
			`https://api.themoviedb.org/3/search/${searchType}`,
			{
				method: "GET",
				signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
				query: {
					query: data.searchQuery,
				},
				headers: {
					authorization: `Bearer ${TMDB_TOKEN}`,
				},
				output: mediaSearchAPIOutput,
			},
		);

		if (error || !mediaContent) {
			console.error("TMDB search failed:", error);
			throw new Error("TMDB search failed");
		}

		return mediaContent;
	});
