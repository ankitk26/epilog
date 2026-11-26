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
import { standardizePersonName } from "@/lib/standardize-person-name";
import { searchMediaAPIOutput, searchMediaListAPIOutput } from "@/types";
import { malMangaSearchAPIOutput } from "@/types/mal";

const MAL_API_URL = "https://api.myanimelist.net/v2/manga";
const SEARCH_TIMEOUT_MS = 10_000;

export const searchMalManga = createServerFn({ method: "GET" })
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
							fields: "id,title,main_picture,alternative_titles,start_date,authors{first_name,last_name},nsfw",
						},
						headers: {
							"X-MAL-CLIENT-ID": clientId,
						},
						output: malMangaSearchAPIOutput,
					}),
				);

				return searchMediaListAPIOutput.parse({
					data: rawContent.data
						.filter(({ node }) => node.nsfw !== "black")
						.map(({ node }) => {
							const author = node.authors[0]?.node;
							const authorName = author
								? standardizePersonName(
										`${author.first_name} ${author.last_name}`.trim(),
									)
								: null;

							return searchMediaAPIOutput.parse({
								imageUrl: node.main_picture?.large ?? null,
								name:
									node.alternative_titles?.en?.trim() ||
									node.title ||
									"Untitled",
								releaseYear: node.start_date
									? new Date(node.start_date).getFullYear()
									: null,
								sourceId: buildSourceMediaId("manga", node.id),
								type: "manga",
								creator: authorName,
								bookAuthorId: null,
							});
						}),
				});
			}),
		),
	);
