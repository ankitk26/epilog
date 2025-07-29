import { getContentSearchResults } from "@/actions/get-content-search-results";
import { useSearchStore } from "@/store/search-store";
import { useQuery } from "@tanstack/react-query";
import MediaCard from "./media-card";
import NoSearchFound from "./no-search-found";
import SearchLoading from "./search-loading";
import { Badge } from "./ui/badge";

export default function ContentResults() {
  const searchQuery = useSearchStore((store) => store.searchQuery);
  const mediaType = useSearchStore((store) => store.mediaType);

  const {
    data: mediaContent,
    isPending,
    isEnabled,
  } = useQuery({
    queryKey: ["search", "media-content", mediaType, searchQuery],
    queryFn: async () =>
      await getContentSearchResults({ data: { searchQuery, mediaType } }),
    enabled: searchQuery.length !== 0 && mediaType !== "book",
  });

  if (isEnabled && isPending) {
    return <SearchLoading />;
  }

  if (!mediaContent || mediaContent.results.length === 0) {
    return <NoSearchFound />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Search Results
        </h3>
        <Badge variant="secondary" className="text-xs">
          {mediaContent.results.length} found
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {mediaContent.results.map((media) => (
          <MediaCard
            key={media.id}
            media={{
              imageUrl:
                media.poster_path &&
                `https://image.tmdb.org/t/p/w500${media.poster_path}`,
              name: media.name ?? media.title ?? "NA",
              releaseYear: media.first_air_date
                ? new Date(media.first_air_date).getFullYear()
                : media.release_date
                ? new Date(media.release_date).getFullYear()
                : null,
              sourceId: media.id,
              type: mediaType,
            }}
          />
        ))}
      </div>
    </div>
  );
}
