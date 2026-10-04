import SearchErrorState from "@/components/search-error-state";
import SearchMediaItem from "@/components/search-media-item";
import SearchNoResultsEmptyState from "@/components/search-no-results-empty-state";
import { useMediaSearch, type SearchMedia } from "@/hooks/use-media-search";
import type { MediaType } from "@/types";
import SearchResultsLoadingState from "./search-results-loading-state";

type Props = {
	query: string;
	type: MediaType;
	onMediaClick: (media: SearchMedia) => void;
};

export default function SearchResultsList({
	onMediaClick,
	query,
	type,
}: Props) {
	const { results, count, isEnabled, isPending, isError, loggedStatuses } =
		useMediaSearch({ query, type });

	if (isEnabled && isPending) {
		return <SearchResultsLoadingState />;
	}

	if (!query) {
		return null;
	}

	if (isError) {
		return <SearchErrorState />;
	}

	if (count === 0) {
		return <SearchNoResultsEmptyState type={type} />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h3 className="section-label">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{count} found
				</span>
				<div className="h-px flex-1 bg-border" />
			</div>

			<div className="flex flex-col gap-4">
				{results.map((media) => (
					<SearchMediaItem
						key={media.sourceId}
						isLogged={!!loggedStatuses?.[media.sourceId]}
						media={media}
						onClick={() => onMediaClick(media)}
					/>
				))}
			</div>
		</div>
	);
}
