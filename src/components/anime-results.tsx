import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { getAnimeSearchResults } from "@/actions/get-anime-search-results";
import { buildSourceMediaId } from "@/lib/source-media-id";
import MediaCard from "./media-card";
import NoSearchFound from "./no-search-found";
import SearchLoading from "./search-loading";
import type { SearchMedia } from "./search-results";

type Props = {
	onMediaClick: (media: SearchMedia) => void;
};

export default function AnimeResults({ onMediaClick }: Props) {
	const { q: searchQuery, type: mediaType } = useSearch({
		from: "/_auth/search",
	});

	const {
		data: animeContent,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "media-content", mediaType, searchQuery],
		queryFn: async () =>
			await getAnimeSearchResults({ data: { searchQuery } }),
		enabled: searchQuery.length !== 0 && mediaType === "anime",
	});

	if (isEnabled && isPending) {
		return <SearchLoading />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!animeContent || animeContent.data.length === 0) {
		return <NoSearchFound />;
	}

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{animeContent.data.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>
			<div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-4">
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
						<MediaCard
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
