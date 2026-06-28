import { cn } from "@/lib/utils";
import type { CalendarMovieEvent } from "@/types/calendar-movie-event";

type Props = {
	event: CalendarMovieEvent;
	isCurrentDayCell: boolean;
	onClick: (e: React.MouseEvent) => void;
};

export default function MovieCalendarEventChip({
	event,
	isCurrentDayCell,
	onClick,
}: Props) {
	return (
		<button
			type="button"
			onClick={(e) => onClick(e)}
			className={cn(
				"truncate rounded-sm px-0.5 py-0.5 text-left text-[9px] leading-tight transition-opacity hover:opacity-90 sm:px-1.5 sm:py-1 sm:text-[11px]",
				isCurrentDayCell
					? "bg-primary-foreground text-primary"
					: "bg-primary text-primary-foreground",
			)}
		>
			{event.name}
		</button>
	);
}
