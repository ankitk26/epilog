import { useMediaFilters } from "@/hooks/use-media-filters";
import MediaListStatusGroups from "./media-list-status-groups";
import MediaMovieCalendarView from "./media-movie-calendar-view";
import MediaShelfView from "./media-shelf-view";

export default function MediaViewContent() {
	const { view } = useMediaFilters();

	if (view === "shelf") {
		return <MediaShelfView />;
	}

	if (view === "calendar") {
		return <MediaMovieCalendarView />;
	}

	return <MediaListStatusGroups />;
}
