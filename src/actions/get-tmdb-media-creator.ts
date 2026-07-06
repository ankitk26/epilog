import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

const tmdbMovieCreditsOutput = z.object({
	crew: z
		.array(
			z.object({
				job: z.string(),
				name: z.string(),
			}),
		)
		.default([]),
});

const tmdbTvDetailsOutput = z.object({
	created_by: z
		.array(
			z.object({
				name: z.string(),
			}),
		)
		.default([]),
	networks: z
		.array(
			z.object({
				name: z.string(),
			}),
		)
		.default([]),
});

function extractTmdbId(sourceMediaId: string): string | null {
	const parts = sourceMediaId.split(":");
	const last = parts.at(-1);
	return last ?? null;
}

async function fetchMovieDirector(
	sourceMediaId: string,
): Promise<string | null> {
	const tmdbId = extractTmdbId(sourceMediaId);
	if (!tmdbId) return null;

	const TMDB_TOKEN = process.env.TMDB_TOKEN;

	const { data, error } = await betterFetch(
		`https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
		{
			method: "GET",
			headers: {
				authorization: `Bearer ${TMDB_TOKEN}`,
			},
			output: tmdbMovieCreditsOutput,
		},
	);

	if (error || !data) {
		console.error("TMDB movie credits error:", error);
		return null;
	}

	const director = data.crew.find((person) => person.job === "Director");
	return director?.name ?? null;
}

async function fetchTvCreator(sourceMediaId: string): Promise<string | null> {
	const tmdbId = extractTmdbId(sourceMediaId);
	if (!tmdbId) return null;

	const TMDB_TOKEN = process.env.TMDB_TOKEN;

	const { data, error } = await betterFetch(
		`https://api.themoviedb.org/3/tv/${tmdbId}`,
		{
			method: "GET",
			headers: {
				authorization: `Bearer ${TMDB_TOKEN}`,
			},
			output: tmdbTvDetailsOutput,
		},
	);

	if (error || !data) {
		console.error("TMDB TV details error:", error);
		return null;
	}

	return data.networks[0]?.name ?? data.created_by[0]?.name ?? null;
}

export const getTmdbMediaCreator = createServerFn({ method: "GET" })
	.inputValidator(
		z.object({
			sourceMediaId: z.string(),
			type: z.enum(["movie", "tv"]),
		}),
	)
	.handler(async ({ data }) => {
		if (data.type === "movie") {
			return fetchMovieDirector(data.sourceMediaId);
		}

		return fetchTvCreator(data.sourceMediaId);
	});
