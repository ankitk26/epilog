import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import CalendarDay from "./calendar-day";
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

	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const [selectedYear, setSelectedYear] = useState(currentYear);

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

	return (
		<div className="col-span-12 h-full">
			<div className="flex items-center justify-start">
				<div className="flex items-center gap-2">
					<Button variant="outline" onClick={goToCurrentMonth}>
						Current month
					</Button>
					<Button
						size="icon"
						variant="outline"
						onClick={goToPreviousMonth}
					>
						<ChevronLeftIcon />
					</Button>
					<Button
						size="icon"
						variant="outline"
						onClick={goToNextMonth}
					>
						<ChevronRightIcon />
					</Button>
				</div>

				<h1 className="p-2">
					{months[selectedMonth]} {selectedYear}
				</h1>
			</div>

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
						(_, index) => {
							const day =
								totalDaysInPreviousMonth +
								index -
								currentMonthFirstDayWeekDay;

							return (
								<CalendarDay
									key={`${index + 1}_${selectedMonth - 1}_${selectedYear}`}
									label={day}
									day={day}
									month={
										selectedMonth === 0
											? 11
											: selectedMonth - 1
									}
									year={
										selectedMonth === 0
											? selectedYear - 1
											: selectedYear
									}
								/>
							);
						},
					)}

					{/*Fill current month days*/}
					{Array.from({ length: totalDaysInCurrentMonth }).map(
						(_, index) => (
							<CalendarDay
								key={`${index + 1}_${selectedMonth}_${selectedYear}`}
								label={index + 1}
								day={index + 1}
								month={selectedMonth}
								year={selectedYear}
								isCurrentMonth
							/>
						),
					)}

					{/*Fill next month's days*/}
					{Array.from({ length: 6 - currentMonthLastDayWeekDay }).map(
						(_, index) => (
							<CalendarDay
								key={`${index + 1}_${selectedMonth + 1}_${selectedYear}`}
								label={index + 1}
								day={index + 1}
								month={
									selectedMonth === 11 ? 0 : selectedMonth + 1
								}
								year={
									selectedMonth === 11
										? selectedYear + 1
										: selectedYear
								}
							/>
						),
					)}
				</div>
			</div>
		</div>
	);
}
