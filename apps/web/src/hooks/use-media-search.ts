import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { searchMalAnime } from "@/actions/search-mal-anime";
import { searchMalManga } from "@/actions/search-mal-manga";
import { searchOpenLibraryBooks } from "@/actions/search-open-library-books";
import { searchTmdbMoviesAndTv } from "@/actions/search-tmdb-movies-and-tv";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import { buildTmdbPosterImageUrl } from "@/lib/build-tmdb-poster-image-url";
import { getTmdbMediaReleaseYear } from "@/lib/get-tmdb-media-release-year";
import { standardizePersonName } from "@/lib/standardize-person-name";
import type { MediaType } from "@/types";

export type SearchMedia = {
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	sourceId: string;
	type: "movie" | "tv" | "anime" | "book" | "manga";
	creator?: string | null;
	seriesName?: string;
	seriesPosition?: number;
	seriesTotal?: number;
	seriesKey?: string;
};

async function searchByType(query: string, type: MediaType) {
	switch (type) {
		case "anime": {
			const { data } = await searchMalAnime({
				data: { searchQuery: query },
			});
			return data.map((anime): SearchMedia => {
				return {
					imageUrl: anime.images.webp?.large_image_url,
					name: anime.title_english ?? anime.title ?? "NA",
					releaseYear: anime.aired.from
						? new Date(anime.aired.from).getFullYear()
						: null,
					sourceId: buildSourceMediaId("anime", anime.mal_id),
					type: "anime",
					creator: anime.studios[0]?.name ?? null,
				};
			});
		}
		case "manga": {
			const { data } = await searchMalManga({
				data: { searchQuery: query },
			});
			return data.map((manga): SearchMedia => {
				return {
					imageUrl: manga.images.webp?.large_image_url,
					name:
						manga.title_english?.trim() ||
						manga.title?.trim() ||
						"Untitled",
					releaseYear: manga.published.from
						? new Date(manga.published.from).getFullYear()
						: null,
					sourceId: buildSourceMediaId("manga", manga.mal_id),
					type: "manga",
					creator: standardizePersonName(manga.authors[0]?.name),
				};
			});
		}
		case "book": {
			const { data } = await searchOpenLibraryBooks({
				data: { searchQuery: query },
			});
			return (data ?? []).map(
				(book): SearchMedia => ({
					imageUrl: book.imageUrl,
					name: book.title,
					releaseYear: book.publishYear,
					sourceId: buildSourceMediaId("book", book.id),
					type: "book",
					creator: book.author,
					seriesName: book.seriesName ?? undefined,
					seriesPosition: book.seriesPosition ?? undefined,
					seriesTotal: book.seriesTotal ?? undefined,
					seriesKey: book.seriesKey ?? undefined,
				}),
			);
		}
		case "movie":
		case "tv": {
			const { data } = await searchTmdbMoviesAndTv({
				data: { searchQuery: query, mediaType: type },
			});
			return data.results.map(
				(media): SearchMedia => ({
					imageUrl: buildTmdbPosterImageUrl(media.poster_path),
					name: media.name ?? media.title ?? "NA",
					releaseYear: getTmdbMediaReleaseYear(
						media.release_date,
						media.first_air_date,
					),
					sourceId: buildSourceMediaId(type, media.id),
					type,
				}),
			);
		}
	}
}

export function useMediaSearch({
	query,
	type,
}: {
	query: string;
	type: MediaType;
}) {
	const {
		data: results,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["search", type, query],
		queryFn: async () => await searchByType(query, type),
		enabled: query.length > 0,
		retry: false,
		staleTime: 1000 * 60 * 2,
	});

	const sourceMediaIds = (results ?? []).map((media) => media.sourceId);

	const { data: loggedStatuses } = useQuery({
		...convexQuery(api.logs.getLoggedStatuses, { sourceMediaIds }),
		enabled: sourceMediaIds.length > 0,
	});

	return {
		results: results ?? [],
		count: results?.length ?? 0,
		isPending,
		isEnabled: query.length > 0,
		isError,
		loggedStatuses,
	};
}
