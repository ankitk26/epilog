import { Skeleton } from "./ui/skeleton";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarCellSkeleton({
	isCurrentMonth = false,
}: {
	isCurrentMonth?: boolean;
}) {
	return (
		<div className="col-span-1 flex min-h-14 flex-col gap-1 border p-1 sm:min-h-20 sm:gap-2 sm:p-2 lg:min-h-24 lg:p-3">
			<div className="space-y-1 sm:space-y-2">
				<Skeleton
					className={
						isCurrentMonth
							? "h-3 w-4 sm:h-4 sm:w-6"
							: "h-3 w-4 opacity-60 sm:h-4 sm:w-5"
					}
				/>
				<div className="space-y-0.5 sm:space-y-1">
					<Skeleton className="h-1.5 w-full rounded-full sm:h-3.5" />
					{isCurrentMonth ? (
						<Skeleton className="hidden h-1.5 w-2/3 rounded-full sm:block sm:h-3.5" />
					) : null}
				</div>
			</div>
		</div>
	);
}

export default function MovieCalendarViewSkeleton() {
	return (
		<div className="col-span-12 flex h-full flex-col space-y-4">
			<div className="h-full p-2">
				<div className="grid grid-cols-7">
					{weekDays.map((weekDay) => (
						<span
							key={weekDay}
							className="col-span-1 mb-1 text-center text-xs text-muted-foreground sm:mb-2"
						>
							{weekDay}
						</span>
					))}
					{Array.from({ length: 35 }).map((_, index) => (
						<CalendarCellSkeleton
							isCurrentMonth={index >= 3 && index < 31}
							key={`calendar-cell-skeleton-${index + 1}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
