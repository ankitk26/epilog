import { getContentSearchResults } from "@/actions/get-content-search-results";
import { useSearchStore } from "@/store/search-store";
import { useQuery } from "@tanstack/react-query";
import { Clapperboard, Loader2 } from "lucide-react";
import SearchResultCard from "./search-result-card";
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
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Searching...</span>
        </div>
      </div>
    );
  }

  if (!mediaContent || mediaContent.results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Clapperboard className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">No results found</p>
        <p className="text-xs text-muted-foreground">
          Try a different search term
        </p>
      </div>
    );
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
        {mediaType === "anime"
          ? mediaContent.results
              .filter(
                (result) =>
                  result.original_language === "ja" ||
                  result.original_language === "zh"
              )
              .map((media) => <SearchResultCard key={media.id} media={media} />)
          : mediaContent.results.map((media) => (
              <SearchResultCard key={media.id} media={media} />
            ))}
      </div>
    </div>
  );
}
