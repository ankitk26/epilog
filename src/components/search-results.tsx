import { useSearch } from "@tanstack/react-router";
import { useState } from "react";
import AddMediaDialog from "@/components/add-media-dialog";
import AnimeResults from "./anime-results";
import BookResults from "./book-results";
import ContentResults from "./content-results";
import MangaResults from "./manga-results";

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

export default function SearchResults() {
	const { type: mediaType } = useSearch({ from: "/_auth/search" });
	const [selectedMedia, setSelectedMedia] = useState<SearchMedia | null>(
		null,
	);

	return (
		<div>
			{mediaType === "book" && (
				<BookResults onMediaClick={setSelectedMedia} />
			)}
			{(mediaType === "movie" || mediaType === "tv") && (
				<ContentResults onMediaClick={setSelectedMedia} />
			)}
			{mediaType === "anime" && (
				<AnimeResults onMediaClick={setSelectedMedia} />
			)}
			{mediaType === "manga" && (
				<MangaResults onMediaClick={setSelectedMedia} />
			)}

			<AddMediaDialog
				media={selectedMedia}
				open={!!selectedMedia}
				onOpenChange={(open) => {
					if (!open) setSelectedMedia(null);
				}}
			/>
		</div>
	);
}
