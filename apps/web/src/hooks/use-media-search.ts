import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { searchMalAnime } from "@/actions/search-mal-anime";
import { searchMalManga } from "@/actions/search-mal-manga";
import { searchOpenLibraryBooks } from "@/actions/search-open-library-books";
import { searchTmdbMoviesAndTv } from "@/actions/search-tmdb-movies-and-tv";
import type { MediaType, SearchMediaListOutput } from "@/types";

export type { SearchMedia } from "@/types";

// Every provider action returns the same { data: SearchMedia[] } contract;
// provider-specific fields are mapped server-side inside each action, so
// swapping a provider never touches this hook or its consumers.
type SearchActionArgs = { data: { searchQuery: string } };

type SearchAction = (args: SearchActionArgs) => Promise<SearchMediaListOutput>;

const searchActionByType = {
	movie: ({ data }: SearchActionArgs) =>
		searchTmdbMoviesAndTv({ data: { ...data, mediaType: "movie" } }),
	tv: ({ data }: SearchActionArgs) =>
		searchTmdbMoviesAndTv({ data: { ...data, mediaType: "tv" } }),
	anime: searchMalAnime,
	manga: searchMalManga,
	book: searchOpenLibraryBooks,
} satisfies Record<MediaType, SearchAction>;

async function searchByType(query: string, type: MediaType) {
	const { data } = await searchActionByType[type]({
		data: { searchQuery: query },
	});
	return data;
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
		refetch,
	} = useQuery({
		queryKey: ["search", type, query],
		queryFn: async () => await searchByType(query, type),
		enabled: query.length > 0,
		// Deterministic: a search either resolves on the run it is submitted
		// or surfaces its error; recovery is the user's manual "try again".
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
		refetch,
		loggedStatuses,
	};
}
