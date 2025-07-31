import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { searchStore } from "@/store/search-store";

export default function BookResults() {
  const searchQuery = useStore(searchStore, (state) => state.searchQuery);
  const mediaType = useStore(searchStore, (state) => state.mediaType);

  const {
    data: books,
    isPending,
    isEnabled,
  } = useQuery({
    queryKey: ["search", "books", mediaType, searchQuery],
    queryFn: () => {
      console.log("Hello");
    },
    enabled: searchQuery.length !== 0 && mediaType === "book",
  });

  if (isEnabled && isPending) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Book results</h1>
      <pre>{JSON.stringify(books, null, 4)}</pre>
    </div>
  );
}
