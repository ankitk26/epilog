import { useQuery } from "@tanstack/react-query";
import { searchJikanManga } from "@/actions/search-jikan-manga";
import SearchMediaListItem from "@/components/search-media-list-item";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import SearchNoResultsEmptyState from "./search-no-results-empty-state";
import SearchResultsLoadingList from "./search-results-loading-list";
import type { SearchMedia } from "./search-results-panel";

type Props = {
	onMediaClick: (media: SearchMedia) => void;
	query: string;
};

export default function SearchMangaResultsGrid({
	onMediaClick,
	query: searchQuery,
}: Props) {
	const {
		data: mangaContent,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "media-content", "manga", searchQuery],
		queryFn: async () => await searchJikanManga({ data: { searchQuery } }),
		enabled: searchQuery.length !== 0,
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingList />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!mangaContent || mangaContent.data.length === 0) {
		return <SearchNoResultsEmptyState type="manga" />;
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
			<div className="flex flex-col gap-1">
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
						<SearchMediaListItem
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
