import { cn } from "@/lib/utils";

type Props = {
	label: number;
	isCurrentMonth?: boolean;
};

export default function CalendarDay({ label, isCurrentMonth = false }: Props) {
	return (
		<div
			className={cn(
				"col-span-1 flex h-20 w-full border p-4 text-xs",
				isCurrentMonth ? "" : "text-muted-foreground",
			)}
		>
			{label}
		</div>
	);
}
