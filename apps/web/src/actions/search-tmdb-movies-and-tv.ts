import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import z from "zod";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import { buildTmdbPosterImageUrl } from "@/lib/build-tmdb-poster-image-url";
import { getTmdbMediaReleaseYear } from "@/lib/get-tmdb-media-release-year";
import {
	providerFetch,
	ProviderUnavailable,
	runProvider,
} from "@/lib/provider-fetch";
import {
	mediaSearchAPIOutput,
	searchMediaAPIOutput,
	searchMediaListAPIOutput,
} from "@/types";

const SEARCH_TIMEOUT_MS = 10_000;

export const searchTmdbMoviesAndTv = createServerFn({ method: "GET" })
	.validator(
		z.object({
			searchQuery: z.string(),
			mediaType: z.union([z.literal("movie"), z.literal("tv")]),
		}),
	)
	.handler(async ({ data }) =>
		runProvider(
			Effect.gen(function* () {
				const TMDB_TOKEN = process.env.TMDB_TOKEN;

				if (!TMDB_TOKEN) {
					return yield* new ProviderUnavailable({
						provider: "tmdb",
						detail: "TMDB_TOKEN is not set",
					});
				}

				const mediaContent = yield* providerFetch("tmdb", () =>
					betterFetch(
						`https://api.themoviedb.org/3/search/${data.mediaType}`,
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
					),
				);

				return searchMediaListAPIOutput.parse({
					data: mediaContent.results.map((media) =>
						searchMediaAPIOutput.parse({
							imageUrl: buildTmdbPosterImageUrl(
								media.poster_path,
							),
							name: media.name ?? media.title ?? "Untitled",
							releaseYear: getTmdbMediaReleaseYear(
								media.release_date,
								media.first_air_date,
							),
							sourceId: buildSourceMediaId(
								data.mediaType,
								media.id,
							),
							type: data.mediaType,
							creator: null,
							bookAuthorId: null,
						}),
					),
				});
			}),
		),
	);
