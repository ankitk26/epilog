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
	isSelected?: boolean;
	onSelect?: () => void;
	events?: CalendarMovieEvent[];
};

// Use primary color for all event bars

export default function CalendarDay({
	label,
	day,
	month,
	year,
	isCurrentMonth = false,
	isSelected = false,
	onSelect,
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

	const handleDayClick = () => {
		onSelect?.();
	};

	// All event bars use primary color
	const getEventColor = () => {
		return "bg-primary";
	};

	return (
		<>
			<div
				onClick={handleDayClick}
				className={cn(
					"col-span-1 flex min-h-14 w-full cursor-pointer flex-col gap-1 border p-1 text-left text-[10px] transition-colors sm:min-h-20 sm:gap-2 sm:p-2 sm:text-xs lg:min-h-24 lg:p-3",
					isCurrentMonth ? "" : "text-muted-foreground",
					isCurrentDayCell
						? "bg-primary text-primary-foreground"
						: "",
					isSelected && !isCurrentDayCell
						? "bg-muted ring-2 ring-primary"
						: "",
				)}
			>
				<div className="flex items-center justify-between gap-1 sm:gap-2">
					<span>{label}</span>
					<CalendarDayAddMovieDialog
						day={day}
						month={month}
						year={year}
					>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
							}}
							className={cn(
								"inline-flex size-4 items-center justify-center rounded-sm transition-colors hover:bg-muted sm:size-5",
								isCurrentDayCell
									? "hover:bg-primary-foreground/20"
									: "hover:bg-muted",
							)}
						>
							<PlusIcon className="size-3" />
						</button>
					</CalendarDayAddMovieDialog>
				</div>

				{/* Mobile: Show colored bars only */}
				<div className="flex flex-col gap-0.5 sm:hidden">
					{events.slice(0, 3).map((_, index) => (
						<div
							key={index}
							className={cn(
								"h-1.5 w-full rounded-full",
								getEventColor(),
							)}
						/>
					))}
					{events.length > 3 && (
						<div className="text-center text-[8px] text-muted-foreground">
							+{events.length - 3}
						</div>
					)}
				</div>

				{/* Desktop/Tablet: Show event name chips */}
				<div className="hidden flex-col gap-0.5 sm:flex sm:gap-1">
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
