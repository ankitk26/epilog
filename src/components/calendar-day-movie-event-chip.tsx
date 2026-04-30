import { cn } from "@/lib/utils";
import type { CalendarMovieEvent } from "@/types/calendar-movie-event";

type Props = {
	event: CalendarMovieEvent;
	isCurrentDayCell: boolean;
	onClick: () => void;
};

export default function CalendarDayMovieEventChip({
	event,
	isCurrentDayCell,
	onClick,
}: Props) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"truncate rounded-sm px-1.5 py-1 text-left text-[11px] leading-tight transition-opacity hover:opacity-90",
				isCurrentDayCell
					? "bg-primary-foreground text-primary"
					: "bg-primary text-primary-foreground",
			)}
		>
			{event.name}
		</button>
	);
}
