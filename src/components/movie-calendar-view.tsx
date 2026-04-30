import MonthCalendar from "./month-calendar";

export default function MovieCalendarView() {
	return (
		<div className="grid h-full grid-cols-12 gap-2">
			{/*<CalendarMoviesList />*/}
			<MonthCalendar />
		</div>
	);
}
