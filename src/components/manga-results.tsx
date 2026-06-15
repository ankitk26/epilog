import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { getMangaSearchResults } from "@/actions/get-manga-search-results";
import { searchStore } from "@/store/search-store";
import MediaCard from "./media-card";
import NoSearchFound from "./no-search-found";
import SearchLoading from "./search-loading";
import { Badge } from "./ui/badge";

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
		<div className="space-y-3">
			<div className="flex items-center space-x-4">
				<h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
					Search Results
				</h3>
				<Badge className="text-xs" variant="secondary">
					{mangaContent.data.length} found
				</Badge>
			</div>
			<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] lg:gap-4">
				{mangaContent.data.map((manga) => (
					<MediaCard
						key={manga.mal_id}
						media={{
							imageUrl: manga.images.webp?.large_image_url,
							name: manga.title_english ?? manga.title ?? "NA",
							releaseYear: manga.published.from
								? new Date(manga.published.from).getFullYear()
								: null,
							sourceId: `manga-${manga.mal_id}`,
							type: "book",
						}}
					/>
				))}
			</div>
		</div>
	);
}
