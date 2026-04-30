import { useMediaFilters } from "@/hooks/use-media-filters";
import ListViewByStatus from "./list-view-by-status";
import MovieCalendarView from "./movie-calendar-view";
import ShelfView from "./shelf-view";

export default function MainMediaContent() {
	const { view } = useMediaFilters();

	if (view === "shelf") {
		return <ShelfView />;
	}

	if (view === "calendar") {
		return <MovieCalendarView />;
	}

	return <ListViewByStatus />;
}
