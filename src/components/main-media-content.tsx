import { useMediaFilters } from "@/hooks/use-media-filters";
import KanbanView from "./kanban-view";
import ListViewByStatus from "./list-view-by-status";
import MovieCalendarView from "./movie-calendar-view";

export default function MainMediaContent() {
	const { view } = useMediaFilters();

	if (view === "kanban") {
		return <KanbanView />;
	}

	if (view === "calendar") {
		return <MovieCalendarView />;
	}

	return <ListViewByStatus />;
}
