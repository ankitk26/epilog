import { getAnimeSearchResults } from "@/actions/get-anime-search-results";
import { useSearchStore } from "@/store/search-store";
import { useQuery } from "@tanstack/react-query";
import MediaCard from "./media-card";
import NoSearchFound from "./no-search-found";
import SearchLoading from "./search-loading";
import { Badge } from "./ui/badge";

export default function AnimeResults() {
  const searchQuery = useSearchStore((store) => store.searchQuery);
  const mediaType = useSearchStore((store) => store.mediaType);

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

  if (!animeContent || animeContent.data.length === 0) {
    return <NoSearchFound />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Search Results
        </h3>
        <Badge variant="secondary" className="text-xs">
          {animeContent.data.length} found
        </Badge>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {animeContent.data.map((anime) => (
          <MediaCard
            key={anime.mal_id}
            media={{
              imageUrl: anime.images.webp?.large_image_url,
              name: anime.title_english ?? anime.title ?? "NA",
              releaseYear: anime.aired.from
                ? new Date(anime.aired.from).getFullYear()
                : null,
              sourceId: anime.mal_id,
              type: "anime",
            }}
          />
        ))}
      </div>
    </div>
  );
}
