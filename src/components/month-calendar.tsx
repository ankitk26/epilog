import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CalendarMovieEvent } from "@/types/calendar-movie-event";
import CalendarDay from "./calendar-day";
import CalendarDayAddMovieDialog from "./calendar-day-add-movie-dialog";
import MobileDayEventsList from "./mobile-day-events-list";
import { Button } from "./ui/button";

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
	const isMobile = useIsMobile();

	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const [selectedYear, setSelectedYear] = useState(currentYear);
	const [selectedDate, setSelectedDate] = useState<{
		day: number;
		month: number;
		year: number;
	} | null>(null);
	const [addMovieDate, setAddMovieDate] = useState<{
		day: number;
		month: number;
		year: number;
	} | null>(null);
	const { data: movieEvents = [] } = useQuery(
		convexQuery(api.movieEvents.getAll),
	);

	const movieEventsByDate = new Map<string, CalendarMovieEvent[]>();

	for (const eventGroup of movieEvents as FunctionReturnType<
		typeof api.movieEvents.getAll
	>) {
		const [eventDate, movies] = Object.entries(eventGroup)[0] ?? [];

		if (!eventDate || !movies) {
			continue;
		}

		movieEventsByDate.set(eventDate, movies as CalendarMovieEvent[]);
	}

	const totalDaysInPreviousMonth = new Date(
		selectedYear,
		selectedMonth,
		0,
	).getDate();

	const totalDaysInCurrentMonth = new Date(
		selectedYear,
		selectedMonth + 1,
		0,
	).getDate();

	const currentMonthFirstDayWeekDay = new Date(
		selectedYear,
		selectedMonth,
		1,
	).getDay();

	const currentMonthLastDayWeekDay = new Date(
		selectedYear,
		selectedMonth + 1,
		0,
	).getDay();

	const goToPreviousMonth = () => {
		if (selectedMonth === 0) {
			setSelectedMonth(11);
			setSelectedYear((prev) => prev - 1);
		} else {
			setSelectedMonth((prev) => prev - 1);
		}
	};

	const goToNextMonth = () => {
		if (selectedMonth === 11) {
			setSelectedMonth(0);
			setSelectedYear((prev) => prev + 1);
		} else {
			setSelectedMonth((prev) => prev + 1);
		}
	};

	const goToCurrentMonth = () => {
		setSelectedMonth(new Date().getMonth());
		setSelectedYear(new Date().getFullYear());
	};

	const getEventDateKey = (year: number, month: number, day: number) =>
		`${year.toString().padStart(4, "0")}${(month + 1)
			.toString()
			.padStart(2, "0")}${day.toString().padStart(2, "0")}`;

	const getSelectedDateEvents = (): CalendarMovieEvent[] => {
		if (!selectedDate) return [];
		return (
			movieEventsByDate.get(
				getEventDateKey(
					selectedDate.year,
					selectedDate.month,
					selectedDate.day,
				),
			) ?? []
		);
	};

	const handleSelectDate = (day: number, month: number, year: number) => {
		setSelectedDate({ day, month, year });
	};

	const isDateSelected = (day: number, month: number, year: number) => {
		if (!selectedDate) return false;
		return (
			selectedDate.day === day &&
			selectedDate.month === month &&
			selectedDate.year === year
		);
	};

	const isTodayInSelectedMonth =
		selectedMonth === currentMonth && selectedYear === currentYear;

	const handleAddMovie = (day: number, month: number, year: number) => {
		setAddMovieDate({ day, month, year });
	};

	return (
		<div className="col-span-12 flex h-full flex-col space-y-4">
			<div className="flex items-center justify-start">
				<div className="flex items-center gap-2">
					<Button
						size={isMobile ? "sm" : "default"}
						variant="outline"
						onClick={goToCurrentMonth}
					>
						Current month
					</Button>
					<Button
						size={isMobile ? "icon-sm" : "icon"}
						variant="outline"
						onClick={goToPreviousMonth}
					>
						<CaretLeftIcon />
					</Button>
					<Button
						size={isMobile ? "icon-sm" : "icon"}
						variant="outline"
						onClick={goToNextMonth}
					>
						<CaretRightIcon />
					</Button>
				</div>

				<h1 className="ml-auto p-2 sm:ml-0">
					{months[selectedMonth]} {selectedYear}
				</h1>
			</div>

			<div className="h-full p-2">
				<div className="grid grid-cols-7">
					{weekDays.map((weekDay) => (
						<span
							key={weekDay}
							className="col-span-1 mb-1 text-center text-xs text-muted-foreground sm:mb-2"
						>
							{weekDay}
						</span>
					))}

					{/*Fill previous month days*/}
					{Array.from({ length: currentMonthFirstDayWeekDay }).map(
						(_, index) => {
							const day =
								totalDaysInPreviousMonth +
								index -
								currentMonthFirstDayWeekDay +
								1;
							const month =
								selectedMonth === 0 ? 11 : selectedMonth - 1;
							const year =
								selectedMonth === 0
									? selectedYear - 1
									: selectedYear;

							return (
								<CalendarDay
									key={`${index + 1}_${selectedMonth - 1}_${selectedYear}`}
									label={day}
									day={day}
									month={month}
									year={year}
									isSelected={isDateSelected(
										day,
										month,
										year,
									)}
									onSelect={() =>
										handleSelectDate(day, month, year)
									}
									onAddMovie={() =>
										handleAddMovie(day, month, year)
									}
									events={
										movieEventsByDate.get(
											getEventDateKey(year, month, day),
										) ?? []
									}
								/>
							);
						},
					)}

					{/*Fill current month days*/}
					{Array.from({ length: totalDaysInCurrentMonth }).map(
						(_, index) => {
							const day = index + 1;
							return (
								<CalendarDay
									key={`${index + 1}_${selectedMonth}_${selectedYear}`}
									label={day}
									day={day}
									month={selectedMonth}
									year={selectedYear}
									isCurrentMonth
									isSelected={isDateSelected(
										day,
										selectedMonth,
										selectedYear,
									)}
									onSelect={() =>
										handleSelectDate(
											day,
											selectedMonth,
											selectedYear,
										)
									}
									onAddMovie={() =>
										handleAddMovie(
											day,
											selectedMonth,
											selectedYear,
										)
									}
									events={
										movieEventsByDate.get(
											getEventDateKey(
												selectedYear,
												selectedMonth,
												day,
											),
										) ?? []
									}
								/>
							);
						},
					)}

					{/*Fill next month's days*/}
					{Array.from({ length: 6 - currentMonthLastDayWeekDay }).map(
						(_, index) => {
							const day = index + 1;
							const month =
								selectedMonth === 11 ? 0 : selectedMonth + 1;
							const year =
								selectedMonth === 11
									? selectedYear + 1
									: selectedYear;

							return (
								<CalendarDay
									key={`${index + 1}_${selectedMonth + 1}_${selectedYear}`}
									label={day}
									day={day}
									month={month}
									year={year}
									isSelected={isDateSelected(
										day,
										month,
										year,
									)}
									onSelect={() =>
										handleSelectDate(day, month, year)
									}
									onAddMovie={() =>
										handleAddMovie(day, month, year)
									}
									events={
										movieEventsByDate.get(
											getEventDateKey(year, month, day),
										) ?? []
									}
								/>
							);
						},
					)}
				</div>

				{/* Mobile Events List - Shows below calendar on mobile screens */}
				<MobileDayEventsList
					selectedDate={selectedDate}
					events={getSelectedDateEvents()}
					isTodayInSelectedMonth={isTodayInSelectedMonth}
					currentDay={today.getDate()}
				/>
			</div>

			{/* Desktop: Add Movie Dialog */}
			{addMovieDate && (
				<CalendarDayAddMovieDialog
					day={addMovieDate.day}
					month={addMovieDate.month}
					year={addMovieDate.year}
					open={true}
					onOpenChange={(open) => {
						if (!open) {
							setAddMovieDate(null);
						}
					}}
				/>
			)}
		</div>
	);
}
