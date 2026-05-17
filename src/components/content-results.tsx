import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { getContentSearchResults } from "@/actions/get-content-search-results";
import MediaCard from "@/components/media-card";
import NoSearchFound from "@/components/no-search-found";
import SearchLoading from "@/components/search-loading";
import { Badge } from "@/components/ui/badge";
import { getFullImageFromPosterPath } from "@/lib/get-full-image-from-poster-path";
import { getReleaseYear } from "@/lib/get-movie-release-year";
import { searchStore } from "@/store/search-store";

export default function ContentResults() {
	const searchQuery = useSelector(searchStore, (state) => state.searchQuery);
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	const {
		data: mediaContent,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "media-content", mediaType, searchQuery],
		queryFn: async () =>
			await getContentSearchResults({ data: { searchQuery, mediaType } }),
		enabled: searchQuery.length !== 0 && mediaType !== "book",
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
		<div className="space-y-3">
			<div className="flex items-center space-x-4">
				<h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
					Search Results
				</h3>
				<Badge className="text-xs" variant="secondary">
					{mediaContent.results.length} found
				</Badge>
			</div>

			<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] lg:gap-4">
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
