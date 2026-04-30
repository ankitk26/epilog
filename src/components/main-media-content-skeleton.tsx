import { useMediaFilters } from "@/hooks/use-media-filters";
import GridViewSkeleton from "./grid-view-skeleton";
import ListViewSkeleton from "./list-view-skeleton";
import MovieCalendarViewSkeleton from "./movie-calendar-view-skeleton";
import ShelfViewSkeleton from "./shelf-view-skeleton";

export default function MainMediaContentSkeleton() {
	const { view } = useMediaFilters();

	if (view === "shelf") {
		return <ShelfViewSkeleton />;
	}

	if (view === "calendar") {
		return <MovieCalendarViewSkeleton />;
	}

	if (view === "grid") {
		return <GridViewSkeleton />;
	}

	return <ListViewSkeleton />;
}
