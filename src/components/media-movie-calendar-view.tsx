import MovieCalendarMonthGrid from "./movie-calendar-month-grid";

export default function MediaMovieCalendarView() {
	return (
		<div className="grid h-full grid-cols-12 gap-2">
			{/*<MovieCalendarDayEventsList />*/}
			<MovieCalendarMonthGrid />
		</div>
	);
}
