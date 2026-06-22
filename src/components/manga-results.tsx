import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { getMangaSearchResults } from "@/actions/get-manga-search-results";
import { buildSourceMediaId } from "@/lib/source-media-id";
import { searchStore } from "@/store/search-store";
import MediaCard from "./media-card";
import NoSearchFound from "./no-search-found";
import SearchLoading from "./search-loading";

export default function MangaResults() {
	const searchQuery = useSelector(searchStore, (state) => state.searchQuery);
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	const {
		data: mangaContent,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "media-content", mediaType, searchQuery],
		queryFn: async () =>
			await getMangaSearchResults({ data: { searchQuery } }),
		enabled: searchQuery.length !== 0 && mediaType === "manga",
	});

	if (isEnabled && isPending) {
		return <SearchLoading />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!mangaContent || mangaContent.data.length === 0) {
		return <NoSearchFound />;
	}

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{mangaContent.data.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>
			<div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-4">
				{mangaContent.data.map((manga) => (
					<MediaCard
						key={manga.mal_id}
						media={{
							imageUrl: manga.images.webp?.large_image_url,
							name: manga.title_english ?? manga.title ?? "NA",
							releaseYear: manga.published.from
								? new Date(manga.published.from).getFullYear()
								: null,
							sourceId: buildSourceMediaId("manga", manga.mal_id),
							type: "manga",
						}}
					/>
				))}
			</div>
		</div>
	);
}
