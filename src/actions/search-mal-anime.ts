import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { type AnimeSearchOutput, animeSearchAPIOutput } from "@/types";
import { malAnimeSearchAPIOutput } from "@/types/mal";

const MAL_API_URL = "https://api.myanimelist.net/v2/anime";

export const searchMalAnime = createServerFn({ method: "GET" })
	.inputValidator(z.object({ searchQuery: z.string() }))
	.handler(async ({ data }) => {
		const clientId = process.env.MAL_CLIENT_ID;

		if (!clientId) {
			console.error("MAL_CLIENT_ID is not set");
			return { data: [] } as AnimeSearchOutput;
		}

		const { data: rawContent, error } = await betterFetch(MAL_API_URL, {
			method: "GET",
			query: {
				q: data.searchQuery,
				limit: "25",
				fields: "id,title,main_picture,alternative_titles,start_date,studios",
			},
			headers: {
				"X-MAL-CLIENT-ID": clientId,
			},
			output: malAnimeSearchAPIOutput,
		});

		if (error) {
			console.error(
				"MAL anime search failed:",
				JSON.stringify(
					{
						query: data.searchQuery,
						error,
					},
					null,
					2,
				),
			);
			return { data: [] } as AnimeSearchOutput;
		}

		const mapped: AnimeSearchOutput = {
			data: rawContent.data.map(({ node }) => ({
				mal_id: node.id,
				title: node.title,
				title_english: node.alternative_titles?.en ?? null,
				images: {
					jpg: { large_image_url: node.main_picture?.large ?? null },
					webp: { large_image_url: node.main_picture?.large ?? null },
				},
				aired: { from: node.start_date ?? null },
				studios: node.studios,
			})),
		};

		return animeSearchAPIOutput.parse(mapped);
	});
