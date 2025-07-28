import { useSearchStore } from "@/store/search-store";
import { Button } from "./ui/button";

export default function SearchMediaButtons() {
  const mediaType = useSearchStore((store) => store.mediaType);
  const setMediaType = useSearchStore((store) => store.setMediaType);

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
