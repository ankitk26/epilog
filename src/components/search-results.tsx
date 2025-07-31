import { searchStore } from "@/store/search-store";
import { useStore } from "@tanstack/react-store";
import AnimeResults from "./anime-results";
import BookResults from "./book-results";
import ContentResults from "./content-results";

export default function SearchResults() {
  const mediaType = useStore(searchStore, (state) => state.mediaType);

  return (
    <div>
      {mediaType === "book" && <BookResults />}
      {(mediaType === "movie" || mediaType === "tv") && <ContentResults />}
      {mediaType === "anime" && <AnimeResults />}
    </div>
  );
}
