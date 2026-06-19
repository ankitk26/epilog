import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { getContentSearchResults } from "@/actions/get-content-search-results";
import MediaCard from "@/components/media-card";
import NoSearchFound from "@/components/no-search-found";
import SearchLoading from "@/components/search-loading";
import { getFullImageFromPosterPath } from "@/lib/get-full-image-from-poster-path";
import { getReleaseYear } from "@/lib/get-movie-release-year";
import { searchStore } from "@/store/search-store";

export default function ContentResults() {
	const searchQuery = useSelector(searchStore, (state) => state.searchQuery);
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

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
			await getContentSearchResults({
				data: { searchQuery, mediaType },
			}),
		enabled: searchQuery.length !== 0,
	});

	if (isEnabled && isPending) {
		return <SearchLoading />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!mediaContent || mediaContent.results.length === 0) {
		return <NoSearchFound />;
	}

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm tabular-nums text-muted-foreground">
					{mediaContent.results.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>

			<div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-4">
				{mediaContent.results.map((media) => {
					const releaseYear = getReleaseYear(
						media.release_date,
						media.first_air_date,
					);

					const posterImage = getFullImageFromPosterPath(
						media.poster_path,
					);

					return (
						<MediaCard
							key={media.id}
							media={{
								imageUrl: posterImage,
								name: media.name ?? media.title ?? "NA",
								releaseYear,
								sourceId: media.id.toString(),
								type: mediaType,
							}}
						/>
					);
				})}
			</div>
		</div>
	);
}
