import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { getBookSearchResults } from "@/actions/get-book-search-results";
import MediaCard from "@/components/media-card";
import NoSearchFound from "@/components/no-search-found";
import SearchLoading from "@/components/search-loading";
import { Badge } from "@/components/ui/badge";
import { searchStore } from "@/store/search-store";

export default function BookResults() {
  const searchQuery = useStore(searchStore, (state) => state.searchQuery);
  const mediaType = useStore(searchStore, (state) => state.mediaType);

  const {
    data: books,
    isPending,
    isEnabled,
  } = useQuery({
    queryKey: ["search", "book", mediaType, searchQuery],
    queryFn: async () => await getBookSearchResults({ data: { searchQuery } }),
    enabled: searchQuery.length !== 0 && mediaType === "book",
  });

  if (isEnabled && isPending) {
    return <SearchLoading />;
  }

  if (!searchQuery) {
    return null;
  }

  if (!books || books.data.length === 0) {
    return <NoSearchFound />;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-4">
        <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
          Search Results
        </h3>
        <Badge className="text-xs" variant="secondary">
          {books.data.length} found
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {books.data.map((book) => {
          let publishYear: number | null = null;
          if (book.published.from) {
            publishYear = new Date(book.published.from).getFullYear();
          }

          return (
            <MediaCard
              key={book.mal_id}
              media={{
                imageUrl: book.images.webp?.large_image_url,
                name: book.title_english ?? book.title ?? "NA",
                releaseYear: publishYear,
                sourceId: book.mal_id.toString(),
                type: "book",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
