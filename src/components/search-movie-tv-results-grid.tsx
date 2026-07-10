import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { searchTmdbMoviesAndTv } from "@/actions/search-tmdb-movies-and-tv";
import SearchMediaListItem from "@/components/search-media-list-item";
import SearchNoResultsEmptyState from "@/components/search-no-results-empty-state";
import SearchResultsLoadingList from "@/components/search-results-loading-list";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import { buildTmdbPosterImageUrl } from "@/lib/build-tmdb-poster-image-url";
import { getTmdbMediaReleaseYear } from "@/lib/get-tmdb-media-release-year";
import type { SearchMedia } from "./search-results-panel";

type Props = {
	mediaType: "movie" | "tv";
	onMediaClick: (media: SearchMedia) => void;
	query: string;
};

export default function SearchMovieTvResultsGrid({
	mediaType,
	onMediaClick,
	query: searchQuery,
}: Props) {
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

	const sourceMediaIds = (mediaContent?.results ?? []).map((media) =>
		buildSourceMediaId(mediaType, media.id),
	);

	const { data: loggedStatuses } = useQuery({
		...convexQuery(api.logs.getLoggedStatuses, { sourceMediaIds }),
		enabled: sourceMediaIds.length > 0,
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingList />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!mediaContent || mediaContent.results.length === 0) {
		return <SearchNoResultsEmptyState type={mediaType} />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{mediaContent.results.length} found
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="flex flex-col gap-1">
				{mediaContent.results.map((media) => {
					const releaseYear = getTmdbMediaReleaseYear(
						media.release_date,
						media.first_air_date,
					);

					const posterImage = buildTmdbPosterImageUrl(
						media.poster_path,
					);

					const sourceId = buildSourceMediaId(mediaType, media.id);

					const searchMedia: SearchMedia = {
						imageUrl: posterImage,
						name: media.name ?? media.title ?? "NA",
						releaseYear,
						sourceId,
						type: mediaType,
					};

					return (
						<SearchMediaListItem
							key={media.id}
							isLogged={!!loggedStatuses?.[sourceId]}
							media={searchMedia}
							onClick={() => onMediaClick(searchMedia)}
						/>
					);
				})}
			</div>
		</div>
	);
}
