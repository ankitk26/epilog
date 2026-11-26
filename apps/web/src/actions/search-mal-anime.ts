import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import z from "zod";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import {
	providerFetch,
	ProviderUnavailable,
	runProvider,
} from "@/lib/provider-fetch";
import { searchMediaAPIOutput, searchMediaListAPIOutput } from "@/types";
import { malAnimeSearchAPIOutput } from "@/types/mal";

const MAL_API_URL = "https://api.myanimelist.net/v2/anime";
const SEARCH_TIMEOUT_MS = 10_000;

export const searchMalAnime = createServerFn({ method: "GET" })
	.validator(z.object({ searchQuery: z.string() }))
	.handler(async ({ data }) =>
		runProvider(
			Effect.gen(function* () {
				const clientId = process.env.MAL_CLIENT_ID;

				if (!clientId) {
					return yield* new ProviderUnavailable({
						provider: "myanimelist",
						detail: "MAL_CLIENT_ID is not set",
					});
				}

				const rawContent = yield* providerFetch("myanimelist", () =>
					betterFetch(MAL_API_URL, {
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
					}),
				);

				return searchMediaListAPIOutput.parse({
					data: rawContent.data.map(({ node }) =>
						searchMediaAPIOutput.parse({
							imageUrl: node.main_picture?.large ?? null,
							name:
								node.alternative_titles?.en ??
								node.title ??
								"Untitled",
							releaseYear: node.start_date
								? new Date(node.start_date).getFullYear()
								: null,
							sourceId: buildSourceMediaId("anime", node.id),
							type: "anime",
							creator: node.studios[0]?.name ?? null,
							bookAuthorId: null,
						}),
					),
				});
			}),
		),
	);
