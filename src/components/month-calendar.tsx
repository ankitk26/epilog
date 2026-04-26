import CalendarDay from "./calendar-day";

const months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
];

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthCalendar() {
	const today = new Date();

	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();

	const totalDaysInPreviousMonth = new Date(
		currentYear,
		currentMonth,
		0,
	).getDate();

	const totalDaysInCurrentMonth = new Date(
		currentYear,
		currentMonth + 1,
		0,
	).getDate();

	const currentMonthFirstDayWeekDay = new Date(
		currentYear,
		currentMonth,
		1,
	).getDay();

	const currentMonthLastDayWeekDay = new Date(
		currentYear,
		currentMonth + 1,
		0,
	).getDay();

	return (
		<div className="col-span-12 h-full">
			<h1 className="p-2">
				{months[currentMonth]} {currentYear}
			</h1>

			<div className="h-full p-2">
				<div className="grid grid-cols-7">
					{weekDays.map((weekDay) => (
						<span
							key={weekDay}
							className="col-span-1 mb-2 text-center text-xs text-muted-foreground"
						>
							{weekDay}
						</span>
					))}

					{/*Fill previous month days*/}
					{Array.from({ length: currentMonthFirstDayWeekDay }).map(
						(_, index) => (
							<CalendarDay
								label={
									totalDaysInPreviousMonth +
									index -
									currentMonthFirstDayWeekDay
								}
							/>
						),
					)}

					{/*Fill current month days*/}
					{Array.from({ length: totalDaysInCurrentMonth }).map(
						(_, index) => (
							<CalendarDay label={index + 1} isCurrentMonth />
						),
					)}

					{/*Fill next month's days*/}
					{Array.from({ length: 6 - currentMonthLastDayWeekDay }).map(
						(_, index) => (
							<CalendarDay label={index + 1} />
						),
					)}
				</div>
			</div>
		</div>
	);
}
