import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AddMediaToLogDialog from "@/components/add-media-to-log-dialog";
import MediaLogDetailsDialog from "@/components/media-log-details-dialog";
import type { MediaType } from "@/types";
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
	creator?: string | null;
	seriesName?: string;
	seriesPosition?: number;
	seriesTotal?: number;
	seriesKey?: string;
};

type Props = {
	query: string;
	type: MediaType;
};

export default function SearchResultsPanel({ query, type: mediaType }: Props) {
	const [selectedMedia, setSelectedMedia] = useState<SearchMedia | null>(
		null,
	);

	const { data: existingLog } = useQuery({
		...convexQuery(api.logs.getBySourceMediaId, {
			sourceMediaId: selectedMedia?.sourceId ?? "",
		}),
		enabled: !!selectedMedia,
	});

	return (
		<div>
			{mediaType === "book" && (
				<SearchBookResultsGrid
					onMediaClick={setSelectedMedia}
					query={query}
				/>
			)}
			{(mediaType === "movie" || mediaType === "tv") && (
				<SearchMovieTvResultsGrid
					mediaType={mediaType}
					onMediaClick={setSelectedMedia}
					query={query}
				/>
			)}
			{mediaType === "anime" && (
				<SearchAnimeResultsGrid
					onMediaClick={setSelectedMedia}
					query={query}
				/>
			)}
			{mediaType === "manga" && (
				<SearchMangaResultsGrid
					onMediaClick={setSelectedMedia}
					query={query}
				/>
			)}

			{existingLog ? (
				<MediaLogDetailsDialog
					log={existingLog}
					open={!!selectedMedia}
					onOpenChange={(open) => {
						if (!open) setSelectedMedia(null);
					}}
				/>
			) : (
				<AddMediaToLogDialog
					media={selectedMedia}
					open={!!selectedMedia}
					onOpenChange={(open) => {
						if (!open) setSelectedMedia(null);
					}}
				/>
			)}
		</div>
	);
}
