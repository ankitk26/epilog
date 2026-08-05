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
				"truncate rounded-full px-1 py-1 text-left text-xs leading-tight shadow-soft transition-all hover:opacity-90 hover:shadow-lift sm:px-2 sm:py-1 sm:text-xs",
				isCurrentDayCell
					? "bg-primary-foreground text-primary"
					: "bg-primary text-primary-foreground",
			)}
		>
			{event.name}
		</button>
	);
}
