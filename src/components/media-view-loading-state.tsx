import { useMediaFilters } from "@/hooks/use-media-filters";
import MediaGridLoadingState from "./media-grid-loading-state";
import MediaListLoadingState from "./media-list-loading-state";
import MovieCalendarLoadingState from "./media-movie-calendar-loading-state";
import MediaShelfLoadingState from "./media-shelf-loading-state";

export default function MediaViewLoadingState() {
	const { view } = useMediaFilters();

	if (view === "shelf") {
		return <MediaShelfLoadingState />;
	}

	if (view === "calendar") {
		return <MovieCalendarLoadingState />;
	}

	if (view === "grid") {
		return <MediaGridLoadingState />;
	}

	return <MediaListLoadingState />;
}
