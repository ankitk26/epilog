import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { getContentSearchResults } from "@/actions/get-content-search-results";
import MediaCard from "@/components/media-card";
import NoSearchFound from "@/components/no-search-found";
import SearchLoading from "@/components/search-loading";
import { Badge } from "@/components/ui/badge";
import { searchStore } from "@/store/search-store";

export default function ContentResults() {
  const searchQuery = useStore(searchStore, (state) => state.searchQuery);
  const mediaType = useStore(searchStore, (state) => state.mediaType);

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
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Search Results
        </h3>
        <Badge className="text-xs" variant="secondary">
          {mediaContent.results.length} found
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {mediaContent.results.map((media) => {
          let releaseYear: number | null = null;
          if (media.release_date) {
            releaseYear = new Date(media.release_date).getFullYear();
          }
          if (media.first_air_date) {
            releaseYear = new Date(media.first_air_date).getFullYear();
          }

          return (
            <MediaCard
              key={media.id}
              media={{
                imageUrl:
                  media.poster_path &&
                  `https://image.tmdb.org/t/p/w500${media.poster_path}`,
                name: media.name ?? media.title ?? "NA",
                releaseYear,
                sourceId: media.id,
                type: mediaType,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
