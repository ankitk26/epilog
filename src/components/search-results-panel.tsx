import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import AddMediaToLogDialog from "@/components/add-media-to-log-dialog";
import SearchAnimeResultsGrid from "./search-anime-results-grid";
import SearchBookResultsGrid from "./search-book-results-grid";
import SearchMangaResultsGrid from "./search-manga-results-grid";
import SearchMovieTvResultsGrid from "./search-movie-tv-results-grid";

export type SearchMedia = {
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	sourceId: string;
	type: "movie" | "tv" | "anime" | "book" | "manga";
	seriesName?: string;
	seriesPosition?: number;
	seriesTotal?: number;
	seriesKey?: string;
};

export default function SearchResultsPanel() {
	const { type: mediaType } = useSearch({ from: "/_auth/search" });
	const [selectedMedia, setSelectedMedia] = useState<SearchMedia | null>(
		null,
	);

	return (
		<div>
			{mediaType === "book" && (
				<SearchBookResultsGrid onMediaClick={setSelectedMedia} />
			)}
			{(mediaType === "movie" || mediaType === "tv") && (
				<SearchMovieTvResultsGrid onMediaClick={setSelectedMedia} />
			)}
			{mediaType === "anime" && (
				<SearchAnimeResultsGrid onMediaClick={setSelectedMedia} />
			)}
			{mediaType === "manga" && (
				<SearchMangaResultsGrid onMediaClick={setSelectedMedia} />
			)}

			<AddMediaToLogDialog
				media={selectedMedia}
				open={!!selectedMedia}
				onOpenChange={(open) => {
					if (!open) setSelectedMedia(null);
				}}
			/>
		</div>
	);
}
