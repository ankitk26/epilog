import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function CalendarCellSkeleton({
	isCurrentMonth = false,
}: {
	isCurrentMonth?: boolean;
}) {
	return (
		<div
			className={`col-span-1 flex min-h-14 flex-col gap-1 p-1 sm:min-h-20 sm:p-2 lg:min-h-24 lg:p-3 ${isCurrentMonth ? "" : "opacity-50"}`}
		>
			<Skeleton className="h-3 w-4" />
			{isCurrentMonth ? <Skeleton className="h-3 w-full" /> : null}
		</div>
	);
}

export default function MediaMovieCalendarLoadingState() {
	return (
		<div className="col-span-12 flex h-full flex-col gap-6">
			<div className="flex flex-wrap items-center justify-between gap-3 pb-2">
				<div className="flex items-center gap-1">
					<Button size="default" variant="outline" disabled>
						Current month
					</Button>
					<Button size="icon" variant="outline" disabled>
						<CaretLeftIcon />
					</Button>
					<Button size="icon" variant="outline" disabled>
						<CaretRightIcon />
					</Button>
				</div>

				<h1 className="order-first px-0 text-2xl font-light tracking-tight text-foreground sm:order-none">
					{months[new Date().getMonth()]} {new Date().getFullYear()}
				</h1>
			</div>

			<div className="h-full rounded-xl border border-border/70 bg-card/40 p-2 shadow-sm sm:p-3">
				<div className="grid grid-cols-7 gap-1 sm:gap-2">
					{weekDays.map((weekDay) => (
						<span
							key={weekDay}
							className="col-span-1 mb-2 text-center text-xs font-medium tracking-wide text-muted-foreground uppercase sm:mb-3"
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
