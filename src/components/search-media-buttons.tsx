import { useSelector } from "@tanstack/react-store";
import { searchStore } from "@/store/search-store";
import { Button } from "./ui/button";

export default function SearchMediaButtons() {
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	const setMediaType = (type: typeof mediaType) => {
		searchStore.setState((state) => ({ ...state, mediaType: type }));
	};

	return (
		<div className="flex flex-col space-y-2">
			<p>Select media type</p>
			<div className="flex flex-wrap items-center gap-3">
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
				<Button
					className="text-xs"
					onClick={() => setMediaType("manga")}
					size="sm"
					variant={mediaType === "manga" ? "default" : "outline"}
				>
					Manga
				</Button>
			</div>
		</div>
	);
}
