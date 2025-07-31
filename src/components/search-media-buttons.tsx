import { useStore } from "@tanstack/react-store";
import { searchStore } from "@/store/search-store";
import { Button } from "./ui/button";

export default function SearchMediaButtons() {
  const mediaType = useStore(searchStore, (state) => state.mediaType);

  const setMediaType = (type: typeof mediaType) => {
    searchStore.setState((state) => ({ ...state, mediaType: type }));
  };

  return (
    <div className="flex flex-col space-y-2">
      <p>Select media type</p>
      <div className="flex items-center space-x-4">
        <Button
          className="text-xs"
          onClick={() => setMediaType("anime")}
          size="sm"
          variant={mediaType === "anime" ? "default" : "outline"}
        >
          Anime
        </Button>
        <Button
          className="text-xs"
          onClick={() => setMediaType("tv")}
          size="sm"
          variant={mediaType === "tv" ? "default" : "outline"}
        >
          TV
        </Button>
        <Button
          className="text-xs"
          onClick={() => setMediaType("movie")}
          size="sm"
          variant={mediaType === "movie" ? "default" : "outline"}
        >
          Movies
        </Button>
        <Button
          className="text-xs"
          onClick={() => setMediaType("book")}
          size="sm"
          variant={mediaType === "book" ? "default" : "outline"}
        >
          Books
        </Button>
      </div>
    </div>
  );
}
