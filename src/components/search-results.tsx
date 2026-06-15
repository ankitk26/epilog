import { useSelector } from "@tanstack/react-store";
import { searchStore } from "@/store/search-store";
import AnimeResults from "./anime-results";
import BookResults from "./book-results";
import ContentResults from "./content-results";
import MangaResults from "./manga-results";

export default function SearchResults() {
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	return (
		<div>
			{mediaType === "book" && <BookResults />}
			{(mediaType === "movie" || mediaType === "tv") && (
				<ContentResults />
			)}
			{mediaType === "anime" && <AnimeResults />}
			{mediaType === "manga" && <MangaResults />}
		</div>
	);
}
