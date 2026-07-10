import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useDialogHistory } from "@/hooks/use-dialog-history";
import { cn } from "@/lib/utils";
import type { CalendarMovieEvent } from "@/types/calendar-movie-event";
import MovieCalendarAddEventDialog from "./movie-calendar-add-event-dialog";
import MovieCalendarEventDetailsDialog from "./movie-calendar-event-details-dialog";

// Use primary color for all event bars

type Props = {
	selectedDate: { day: number; month: number; year: number } | null;
	events: CalendarMovieEvent[];
	isTodayInSelectedMonth: boolean;
	currentDay: number;
};

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
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

export default function MovieCalendarMobileDayEventsList({
	selectedDate,
	events,
	isTodayInSelectedMonth,
	currentDay,
}: Props) {
	const [selectedEvent, setSelectedEvent] =
		useState<CalendarMovieEvent | null>(null);

	useDialogHistory(
		!!selectedEvent,
		() => setSelectedEvent(null),
		"mobile-calendar-event",
	);

	const displayDate = selectedDate;

	if (!displayDate) {
		return null;
	}

	const dateObj = new Date(
		displayDate.year,
		displayDate.month,
		displayDate.day,
	);
	const dayOfWeek = weekDays[dateObj.getDay()];
	const isToday = isTodayInSelectedMonth && displayDate.day === currentDay;

	const getEventColor = () => {
		return "bg-primary";
	};

	return (
		<>
			<div className="mt-4 border-t pt-4 sm:hidden">
				<div className="mb-4 flex items-center justify-between px-2">
					<div className="flex items-center gap-2">
						<span
							className={cn(
								"text-3xl font-semibold",
								isToday ? "text-primary" : "text-foreground",
							)}
						>
							{displayDate.day}
						</span>
						<span className="text-lg text-muted-foreground">
							{dayOfWeek}
						</span>
					</div>
					<MovieCalendarAddEventDialog
						day={displayDate.day}
						month={displayDate.month}
						year={displayDate.year}
					>
						<button
							type="button"
							className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
						>
							<PlusIcon className="size-5" />
						</button>
					</MovieCalendarAddEventDialog>
				</div>

				<div className="flex flex-col">
					{events.length === 0 ? (
						<div className="px-2 py-4 text-center text-sm text-muted-foreground">
							No events on {months[displayDate.month]}{" "}
							{displayDate.day}
						</div>
					) : (
						events.map((event) => {
							return (
								<button
									key={event.movieEventId}
									onClick={() => setSelectedEvent(event)}
									className="flex items-center gap-3 px-2 py-3 text-left transition-colors hover:bg-secondary active:bg-secondary"
								>
									<div
										className={cn(
											"h-6 w-1 shrink-0 rounded-lg",
											getEventColor(),
										)}
									/>

									<div className="min-w-0 flex-1">
										<h4 className="truncate text-base font-medium text-foreground">
											{event.name}
										</h4>
									</div>
								</button>
							);
						})
					)}
				</div>
			</div>

			<MovieCalendarEventDetailsDialog
				event={selectedEvent}
				open={selectedEvent !== null}
				onOpenChange={(open) => {
					if (!open) {
						setSelectedEvent(null);
					}
				}}
			/>
		</>
	);
}
