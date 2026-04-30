import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CalendarMovieEvent } from "@/types/calendar-movie-event";
import CalendarDayAddMovieDialog from "./calendar-day-add-movie-dialog";
import CalendarDayMovieEventChip from "./calendar-day-movie-event-chip";
import MovieEventDetailsDialog from "./movie-event-details-dialog";

type Props = {
	label: number;
	day: number;
	month: number;
	year: number;
	isCurrentMonth?: boolean;
	events?: CalendarMovieEvent[];
};

export default function CalendarDay({
	label,
	day,
	month,
	year,
	isCurrentMonth = false,
	events = [],
}: Props) {
	const [selectedEvent, setSelectedEvent] =
		useState<CalendarMovieEvent | null>(null);

	const today = new Date();

	const currentMonth = today.getMonth();
	const currentDay = today.getDate();
	const currentYear = today.getFullYear();

	const isDayToday =
		currentDay === day && currentMonth === month && currentYear === year;
	const isCurrentDayCell = isDayToday && isCurrentMonth;

	return (
		<>
			<div
				className={cn(
					"col-span-1 flex min-h-24 w-full flex-col gap-2 border p-3 text-left text-xs",
					isCurrentMonth ? "" : "text-muted-foreground",
					isCurrentDayCell
						? "bg-primary text-primary-foreground"
						: "",
				)}
			>
				<div className="flex items-center justify-between gap-2">
					<span>{label}</span>
					<CalendarDayAddMovieDialog
						day={day}
						month={month}
						year={year}
					>
						<button
							type="button"
							className={cn(
								"inline-flex size-5 items-center justify-center rounded-sm transition-colors hover:bg-muted",
								isCurrentDayCell
									? "hover:bg-primary-foreground/20"
									: "hover:bg-muted",
							)}
						>
							<PlusIcon className="size-3" />
						</button>
					</CalendarDayAddMovieDialog>
				</div>
				<div className="flex flex-col gap-1">
					{events.map((event) => (
						<CalendarDayMovieEventChip
							key={event.movieEventId}
							event={event}
							isCurrentDayCell={isCurrentDayCell}
							onClick={() => setSelectedEvent(event)}
						/>
					))}
				</div>
			</div>
			<MovieEventDetailsDialog
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
