import { useSearchStore } from "@/store/search-store";
import { useQuery } from "@tanstack/react-query";

export default function BookResults() {
  const searchQuery = useSearchStore((store) => store.searchQuery);
  const mediaType = useSearchStore((store) => store.mediaType);

  const {
    data: books,
    isPending,
    isEnabled,
  } = useQuery({
    queryKey: ["search", "books", mediaType, searchQuery],
    queryFn: () => {},
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
