import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { type MangaSearchOutput, mangaSearchAPIOutput } from "@/types";
import { malMangaSearchAPIOutput } from "@/types/mal";

const MAL_API_URL = "https://api.myanimelist.net/v2/manga";

export const searchMalManga = createServerFn({ method: "GET" })
	.inputValidator(z.object({ searchQuery: z.string() }))
	.handler(async ({ data }) => {
		const clientId = process.env.MAL_CLIENT_ID;

		if (!clientId) {
			console.error("MAL_CLIENT_ID is not set");
			return { data: [] } as MangaSearchOutput;
		}

		const { data: rawContent, error } = await betterFetch(MAL_API_URL, {
			method: "GET",
			query: {
				q: data.searchQuery,
				limit: "25",
				fields: "id,title,main_picture,alternative_titles,start_date,authors{first_name,last_name},nsfw",
			},
			headers: {
				"X-MAL-CLIENT-ID": clientId,
			},
			output: malMangaSearchAPIOutput,
		});

		if (error) {
			console.error(
				"MAL manga search failed:",
				JSON.stringify(
					{
						query: data.searchQuery,
						error,
					},
					null,
					2,
				),
			);
			return { data: [] } as MangaSearchOutput;
		}

		const mapped: MangaSearchOutput = {
			data: rawContent.data
				.filter(({ node }) => node.nsfw !== "black")
				.map(({ node }) => ({
					mal_id: node.id,
					title: node.title,
					title_english: node.alternative_titles?.en ?? null,
					images: {
						jpg: {
							large_image_url: node.main_picture?.large ?? null,
						},
						webp: {
							large_image_url: node.main_picture?.large ?? null,
						},
					},
					published: { from: node.start_date ?? null },
					authors: node.authors.map(({ node: author }) => ({
						name: `${author.first_name} ${author.last_name}`.trim(),
					})),
				})),
		};

		return mangaSearchAPIOutput.parse(mapped);
	});
