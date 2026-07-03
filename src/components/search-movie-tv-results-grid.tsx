import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { searchTmdbMoviesAndTv } from "@/actions/search-tmdb-movies-and-tv";
import MediaPosterCard from "@/components/media-poster-card";
import SearchNoResultsEmptyState from "@/components/search-no-results-empty-state";
import SearchResultsLoadingGrid from "@/components/search-results-loading-grid";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import { buildTmdbPosterImageUrl } from "@/lib/build-tmdb-poster-image-url";
import { getTmdbMediaReleaseYear } from "@/lib/get-tmdb-media-release-year";
import type { SearchMedia } from "./search-results-panel";

type Props = {
	onMediaClick: (media: SearchMedia) => void;
};

export default function SearchMovieTvResultsGrid({ onMediaClick }: Props) {
	const { q: searchQuery, type: mediaType } = useSearch({
		from: "/_auth/search",
	});

	if (mediaType !== "movie" && mediaType !== "tv") {
		return null;
	}

	const {
		data: mediaContent,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "media-content", mediaType, searchQuery],
		queryFn: async () =>
			await searchTmdbMoviesAndTv({
				data: { searchQuery, mediaType },
			}),
		enabled: searchQuery.length !== 0,
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingGrid />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!mediaContent || mediaContent.results.length === 0) {
		return <SearchNoResultsEmptyState />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{mediaContent.results.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>

			<div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-6">
				{mediaContent.results.map((media) => {
					const releaseYear = getTmdbMediaReleaseYear(
						media.release_date,
						media.first_air_date,
					);

					const posterImage = buildTmdbPosterImageUrl(
						media.poster_path,
					);

					const searchMedia: SearchMedia = {
						imageUrl: posterImage,
						name: media.name ?? media.title ?? "NA",
						releaseYear,
						sourceId: buildSourceMediaId(mediaType, media.id),
						type: mediaType,
					};

					return (
						<MediaPosterCard
							displayOnly
							key={media.id}
							media={searchMedia}
							onClick={() => onMediaClick(searchMedia)}
						/>
					);
				})}
			</div>
		</div>
	);
}
