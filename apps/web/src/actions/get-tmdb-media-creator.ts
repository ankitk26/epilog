import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import z from "zod";
import {
	providerFetch,
	ProviderUnavailable,
	runProviderOrElse,
} from "@/lib/provider-fetch";

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

function fetchMovieDirector(sourceMediaId: string) {
	const tmdbId = extractTmdbId(sourceMediaId);
	if (!tmdbId) {
		return Effect.succeed<string | null>(null);
	}

	const TMDB_TOKEN = process.env.TMDB_TOKEN;

	if (!TMDB_TOKEN) {
		return Effect.fail(
			new ProviderUnavailable({
				provider: "tmdb",
				detail: "TMDB_TOKEN is not set",
			}),
		).pipe(Effect.as<string | null>(null));
	}

	return providerFetch("tmdb", () =>
		betterFetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits`, {
			method: "GET",
			headers: {
				authorization: `Bearer ${TMDB_TOKEN}`,
			},
			output: tmdbMovieCreditsOutput,
		}),
	).pipe(
		Effect.map((data) => {
			const director = data.crew.find(
				(person) => person.job === "Director",
			);
			return director?.name ?? null;
		}),
	);
}

function fetchTvCreator(sourceMediaId: string) {
	const tmdbId = extractTmdbId(sourceMediaId);
	if (!tmdbId) {
		return Effect.succeed<string | null>(null);
	}

	const TMDB_TOKEN = process.env.TMDB_TOKEN;

	if (!TMDB_TOKEN) {
		return Effect.fail(
			new ProviderUnavailable({
				provider: "tmdb",
				detail: "TMDB_TOKEN is not set",
			}),
		).pipe(Effect.as<string | null>(null));
	}

	return providerFetch("tmdb", () =>
		betterFetch(`https://api.themoviedb.org/3/tv/${tmdbId}`, {
			method: "GET",
			headers: {
				authorization: `Bearer ${TMDB_TOKEN}`,
			},
			output: tmdbTvDetailsOutput,
		}),
	).pipe(
		Effect.map(
			(data) =>
				data.networks[0]?.name ?? data.created_by[0]?.name ?? null,
		),
	);
}

export const getTmdbMediaCreator = createServerFn({ method: "GET" })
	.validator(
		z.object({
			sourceMediaId: z.string(),
			type: z.enum(["movie", "tv"]),
		}),
	)
	.handler(async ({ data }) => {
		// A creator name is optional decoration: any provider failure logs
		// and degrades to null rather than failing the dialog that wants it.
		if (data.type === "movie") {
			return runProviderOrElse(
				fetchMovieDirector(data.sourceMediaId),
				null,
			);
		}

		return runProviderOrElse(fetchTvCreator(data.sourceMediaId), null);
	});
