import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { getAnimeSearchResults } from "@/actions/get-anime-search-results";
import { searchStore } from "@/store/search-store";
import MediaCard from "./media-card";
import NoSearchFound from "./no-search-found";
import SearchLoading from "./search-loading";
import { Badge } from "./ui/badge";

export default function AnimeResults() {
  const searchQuery = useStore(searchStore, (state) => state.searchQuery);
  const mediaType = useStore(searchStore, (state) => state.mediaType);

  const {
    data: animeContent,
    isPending,
    isEnabled,
  } = useQuery({
    queryKey: ["search", "media-content", mediaType, searchQuery],
    queryFn: async () => await getAnimeSearchResults({ data: { searchQuery } }),
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
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Search Results
        </h3>
        <Badge className="text-xs" variant="secondary">
          {animeContent.data.length} found
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {animeContent.data.map((anime) => (
          <MediaCard
            key={anime.mal_id}
            media={{
              imageUrl: anime.images.webp?.large_image_url,
              name: anime.title_english ?? anime.title ?? "NA",
              releaseYear: anime.aired.from
                ? new Date(anime.aired.from).getFullYear()
                : null,
              sourceId: anime.mal_id.toString(),
              type: "anime",
            }}
          />
        ))}
      </div>
    </div>
  );
}
