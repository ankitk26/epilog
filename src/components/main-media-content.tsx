import { useStore } from "@tanstack/react-store";
import { filterStore } from "@/store/filter-store";
import KanbanView from "./kanban-view";
import ListViewByStatus from "./list-view-by-status";
import MovieCalendarView from "./movie-calendar-view";

export default function MainMediaContent() {
	const view = useStore(filterStore, (state) => state.view);

	if (view === "kanban") {
		return <KanbanView />;
	}

	if (view === "calendar") {
		return <MovieCalendarView />;
	}

	return <ListViewByStatus />;
}
