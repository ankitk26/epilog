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
	const getEventColor = () => {
		return "bg-primary";
	};

	return (
		<>
			<div className="mt-4 pt-4 sm:hidden">
				<div className="mb-4 flex items-center justify-between px-2">
					<div className="flex items-center gap-2">
						<span
							className={cn(
								"text-3xl font-semibold",
								"text-foreground",
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
							className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-soft transition-all hover:bg-secondary hover:shadow-lift"
						>
							<PlusIcon className="size-5" />
						</button>
					</MovieCalendarAddEventDialog>
				</div>

				<div className="flex flex-col gap-2">
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
									className="flex items-center gap-3 rounded-lg border border-border/70 bg-card px-3 py-3 text-left shadow-soft transition-all hover:bg-secondary hover:shadow-lift"
								>
									<div
										className={cn(
											"h-6 w-1 shrink-0",
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
