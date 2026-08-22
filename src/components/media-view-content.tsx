import { useMediaFilters } from "@/hooks/use-media-filters";
import MediaListStatusGroups from "./media-list-status-groups";
import MediaShelfView from "./media-shelf-view";
import MovieCalendarMonthGrid from "./movie-calendar-month-grid";

export default function MediaViewContent() {
	const { view } = useMediaFilters();

	if (view === "shelf") {
		return <MediaShelfView />;
	}

	if (view === "calendar") {
		return (
			<div className="flex h-full flex-col">
				<MovieCalendarMonthGrid />
			</div>
		);
	}

	return <MediaListStatusGroups />;
}
