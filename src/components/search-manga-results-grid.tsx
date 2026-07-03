import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { searchJikanManga } from "@/actions/search-jikan-manga";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import MediaPosterCard from "./media-poster-card";
import SearchNoResultsEmptyState from "./search-no-results-empty-state";
import SearchResultsLoadingGrid from "./search-results-loading-grid";
import type { SearchMedia } from "./search-results-panel";

type Props = {
	onMediaClick: (media: SearchMedia) => void;
};

export default function SearchMangaResultsGrid({ onMediaClick }: Props) {
	const { q: searchQuery, type: mediaType } = useSearch({
		from: "/_auth/search",
	});

	const {
		data: mangaContent,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "media-content", mediaType, searchQuery],
		queryFn: async () => await searchJikanManga({ data: { searchQuery } }),
		enabled: searchQuery.length !== 0 && mediaType === "manga",
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingGrid />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!mangaContent || mangaContent.data.length === 0) {
		return <SearchNoResultsEmptyState />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{mangaContent.data.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-6">
				{mangaContent.data.map((manga) => {
					const searchMedia: SearchMedia = {
						imageUrl: manga.images.webp?.large_image_url,
						name: manga.title_english ?? manga.title ?? "NA",
						releaseYear: manga.published.from
							? new Date(manga.published.from).getFullYear()
							: null,
						sourceId: buildSourceMediaId("manga", manga.mal_id),
						type: "manga",
					};

					return (
						<MediaPosterCard
							displayOnly
							key={manga.mal_id}
							media={searchMedia}
							onClick={() => onMediaClick(searchMedia)}
						/>
					);
				})}
			</div>
		</div>
	);
}
