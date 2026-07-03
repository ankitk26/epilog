import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { searchJikanAnime } from "@/actions/search-jikan-anime";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import MediaPosterCard from "./media-poster-card";
import SearchNoResultsEmptyState from "./search-no-results-empty-state";
import SearchResultsLoadingGrid from "./search-results-loading-grid";
import type { SearchMedia } from "./search-results-panel";

type Props = {
	onMediaClick: (media: SearchMedia) => void;
};

export default function SearchAnimeResultsGrid({ onMediaClick }: Props) {
	const { q: searchQuery, type: mediaType } = useSearch({
		from: "/_auth/search",
	});

	const {
		data: animeContent,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "media-content", mediaType, searchQuery],
		queryFn: async () => await searchJikanAnime({ data: { searchQuery } }),
		enabled: searchQuery.length !== 0 && mediaType === "anime",
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingGrid />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!animeContent || animeContent.data.length === 0) {
		return <SearchNoResultsEmptyState />;
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
			<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-6">
				{animeContent.data.map((anime) => {
					const searchMedia: SearchMedia = {
						imageUrl: anime.images.webp?.large_image_url,
						name: anime.title_english ?? anime.title ?? "NA",
						releaseYear: anime.aired.from
							? new Date(anime.aired.from).getFullYear()
							: null,
						sourceId: buildSourceMediaId("anime", anime.mal_id),
						type: "anime",
					};

					return (
						<MediaPosterCard
							displayOnly
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
