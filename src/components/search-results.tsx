import { useSearchStore } from "@/store/search-store";
import AnimeResults from "./anime-results";
import BookResults from "./book-results";
import ContentResults from "./content-results";

export default function SearchResults() {
  const mediaType = useSearchStore((store) => store.mediaType);

  return (
    <div>
      {mediaType === "book" && <BookResults />}
      {mediaType !== "book" && mediaType !== "anime" && <ContentResults />}
      {mediaType === "anime" && <AnimeResults />}
    </div>
  );
}
