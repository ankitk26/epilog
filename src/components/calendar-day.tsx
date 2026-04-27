import { cn } from "@/lib/utils";

type Props = {
	label: number;
	day: number;
	month: number;
	year: number;
	isCurrentMonth?: boolean;
};

export default function CalendarDay({
	label,
	day,
	month,
	year,
	isCurrentMonth = false,
}: Props) {
	const addMovieEvent = () => {
		const actualMonth = month + 1;
		console.log(`Date = ${day}-${actualMonth}-${year}`);
	};

	const today = new Date();

	const currentMonth = today.getMonth();
	const currentDay = today.getDate();
	const currentYear = today.getFullYear();

	const isDayToday =
		currentDay === day && currentMonth === month && currentYear === year;

	return (
		<button
			className={cn(
				"col-span-1 flex h-20 w-full border p-4 text-xs",
				isCurrentMonth ? "" : "text-muted-foreground",
				isDayToday && isCurrentMonth ? "border-2 border-primary" : "",
			)}
			onClick={addMovieEvent}
		>
			<span>{label}</span>
		</button>
	);
}
