import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import { searchMediaAPIOutput, searchMediaListAPIOutput } from "@/types";
import { malAnimeSearchAPIOutput } from "@/types/mal";

const MAL_API_URL = "https://api.myanimelist.net/v2/anime";
const SEARCH_TIMEOUT_MS = 10_000;

export const searchMalAnime = createServerFn({ method: "GET" })
	.validator(z.object({ searchQuery: z.string() }))
	.handler(async ({ data }) => {
		const clientId = process.env.MAL_CLIENT_ID;

		if (!clientId) {
			console.error("MAL_CLIENT_ID is not set");
			throw new Error("MyAnimeList search is unavailable");
		}

		const { data: rawContent, error } = await betterFetch(MAL_API_URL, {
			method: "GET",
			signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
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
			throw new Error("MyAnimeList search failed");
		}

		return searchMediaListAPIOutput.parse({
			data: rawContent.data.map(({ node }) =>
				searchMediaAPIOutput.parse({
					imageUrl: node.main_picture?.large ?? null,
					name:
						node.alternative_titles?.en ?? node.title ?? "Untitled",
					releaseYear: node.start_date
						? new Date(node.start_date).getFullYear()
						: null,
					sourceId: buildSourceMediaId("anime", node.id),
					type: "anime",
					creator: node.studios[0]?.name ?? null,
					bookAuthorId: null,
					seriesName: null,
					seriesPosition: null,
					seriesTotal: null,
					seriesKey: null,
				}),
			),
		});
	});
