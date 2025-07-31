import { searchStore } from "@/store/search-store";
import { useStore } from "@tanstack/react-store";
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
          size="sm"
          variant={mediaType === "anime" ? "default" : "outline"}
          onClick={() => setMediaType("anime")}
          className="text-xs"
        >
          Anime
        </Button>
        <Button
          size="sm"
          variant={mediaType === "tv" ? "default" : "outline"}
          onClick={() => setMediaType("tv")}
          className="text-xs"
        >
          TV
        </Button>
        <Button
          size="sm"
          variant={mediaType === "movie" ? "default" : "outline"}
          onClick={() => setMediaType("movie")}
          className="text-xs"
        >
          Movies
        </Button>
        <Button
          size="sm"
          variant={mediaType === "book" ? "default" : "outline"}
          onClick={() => setMediaType("book")}
          className="text-xs"
        >
          Books
        </Button>
      </div>
    </div>
  );
}
