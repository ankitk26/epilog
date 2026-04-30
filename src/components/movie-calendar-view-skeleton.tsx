import { Skeleton } from "./ui/skeleton";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarCellSkeleton({
	isCurrentMonth = false,
}: {
	isCurrentMonth?: boolean;
}) {
	return (
		<div className="min-h-24 rounded-lg border p-2">
			<div className="space-y-2">
				<Skeleton
					className={
						isCurrentMonth ? "h-4 w-6" : "h-4 w-5 opacity-60"
					}
				/>
				<div className="space-y-1.5">
					<Skeleton className="h-3.5 w-full rounded-full" />
					{isCurrentMonth ? (
						<Skeleton className="h-3.5 w-2/3 rounded-full" />
					) : null}
				</div>
			</div>
		</div>
	);
}

export default function MovieCalendarViewSkeleton() {
	return (
		<div className="grid h-full grid-cols-12 gap-2">
			<div className="col-span-12 h-full">
				<div className="h-full p-2">
					<div className="grid grid-cols-7 gap-2">
						{weekDays.map((weekDay) => (
							<Skeleton
								className="mb-2 h-4 w-full"
								key={weekDay}
							/>
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
		</div>
	);
}
