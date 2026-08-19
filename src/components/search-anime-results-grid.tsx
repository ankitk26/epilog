import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { searchMalAnime } from "@/actions/search-mal-anime";
import SearchErrorState from "@/components/search-error-state";
import SearchMediaListItem from "@/components/search-media-list-item";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import SearchNoResultsEmptyState from "./search-no-results-empty-state";
import SearchResultsLoadingList from "./search-results-loading-list";
import type { SearchMedia } from "./search-results-panel";

type Props = {
	onMediaClick: (media: SearchMedia) => void;
	query: string;
};

export default function SearchAnimeResultsGrid({
	onMediaClick,
	query: searchQuery,
}: Props) {
	const {
		data: animeContent,
		isPending,
		isEnabled,
		isError,
	} = useQuery({
		queryKey: ["search", "media-content", "anime", searchQuery],
		queryFn: async () => await searchMalAnime({ data: { searchQuery } }),
		enabled: searchQuery.length !== 0,
		retry: false,
	});

	const sourceMediaIds = (animeContent?.data ?? []).map((anime) =>
		buildSourceMediaId("anime", anime.mal_id),
	);

	const { data: loggedStatuses } = useQuery({
		...convexQuery(api.logs.getLoggedStatuses, { sourceMediaIds }),
		enabled: sourceMediaIds.length > 0,
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingList />;
	}

	if (!searchQuery) {
		return null;
	}

	if (isError) {
		return <SearchErrorState />;
	}

	if (!animeContent || animeContent.data.length === 0) {
		return <SearchNoResultsEmptyState type="anime" />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h3 className="section-label">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{animeContent.data.length} found
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8 xl:grid-cols-6">
				{animeContent.data.map((anime) => {
					const sourceId = buildSourceMediaId("anime", anime.mal_id);

					const searchMedia: SearchMedia = {
						imageUrl: anime.images.webp?.large_image_url,
						name: anime.title_english ?? anime.title ?? "NA",
						releaseYear: anime.aired.from
							? new Date(anime.aired.from).getFullYear()
							: null,
						sourceId,
						type: "anime",
						creator: anime.studios[0]?.name ?? null,
					};

					return (
						<SearchMediaListItem
							key={anime.mal_id}
							isLogged={!!loggedStatuses?.[sourceId]}
							media={searchMedia}
							onClick={() => onMediaClick(searchMedia)}
						/>
					);
				})}
			</div>
		</div>
	);
}
