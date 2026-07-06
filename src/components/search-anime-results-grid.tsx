import { useQuery } from "@tanstack/react-query";
import { searchJikanAnime } from "@/actions/search-jikan-anime";
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
	} = useQuery({
		queryKey: ["search", "media-content", "anime", searchQuery],
		queryFn: async () => await searchJikanAnime({ data: { searchQuery } }),
		enabled: searchQuery.length !== 0,
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingList />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!animeContent || animeContent.data.length === 0) {
		return <SearchNoResultsEmptyState type="anime" />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{animeContent.data.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>
			<div className="flex flex-col gap-1">
				{animeContent.data.map((anime) => {
					const searchMedia: SearchMedia = {
						imageUrl: anime.images.webp?.large_image_url,
						name: anime.title_english ?? anime.title ?? "NA",
						releaseYear: anime.aired.from
							? new Date(anime.aired.from).getFullYear()
							: null,
						sourceId: buildSourceMediaId("anime", anime.mal_id),
						type: "anime",
						creator: anime.studios[0]?.name ?? null,
					};

					return (
						<SearchMediaListItem
							key={anime.mal_id}
							media={searchMedia}
							onClick={() => onMediaClick(searchMedia)}
						/>
					);
				})}
			</div>
		</div>
	);
}
