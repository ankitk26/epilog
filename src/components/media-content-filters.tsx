import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import {
	CalendarBlankIcon,
	KanbanIcon,
	SquaresFourIcon,
	ListIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { cn } from "@/lib/utils";
import { FilterMediaView, MediaType } from "@/types";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function MediaContentFilters() {
	const { setType, setView, type, view } = useMediaFilters();

	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	const logCountsByType = [
		{
			type: "movie",
			label: "Movies",
			count: logs.filter((log) => log.metadata.type === "movie").length,
		},
		{
			type: "tv",
			label: "TV Shows",
			count: logs.filter((log) => log.metadata.type === "tv").length,
		},
		{
			type: "anime",
			label: "Anime",
			count: logs.filter((log) => log.metadata.type === "anime").length,
		},
		{
			type: "book",
			label: "Books",
			count: logs.filter((log) => log.metadata.type === "book").length,
		},
	];

	const viewOptions: {
		value: FilterMediaView;
		label: string;
		icon: typeof ListIcon;
	}[] = [
		{ value: "list", label: "List", icon: ListIcon },
		{ value: "grid", label: "Grid", icon: SquaresFourIcon },
		{ value: "shelf", label: "Shelf", icon: KanbanIcon },
		{ value: "calendar", label: "Calendar", icon: CalendarBlankIcon },
	];

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			{/* Media type filter */}
			<div className="grid grid-cols-2 gap-2 md:flex md:items-center">
				{logCountsByType.map((item) => {
					const isActive = type === item.type;
					return (
						<button
							className={cn(
								"flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-xs leading-none font-semibold transition-all duration-300",
								isActive
									? "border-primary/30 bg-primary text-primary-foreground shadow-sm hover:shadow-md"
									: "border-border/60 bg-card text-muted-foreground hover:border-border hover:bg-accent/40 hover:text-foreground",
							)}
							key={item.type}
							onClick={() => {
								setType(item.type as MediaType);
							}}
							type="button"
						>
							<span className="leading-none">{item.label}</span>
							<span
								className={cn(
									"flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] leading-none font-bold",
									isActive
										? "bg-primary-foreground/20 text-primary-foreground"
										: "bg-secondary text-muted-foreground",
								)}
							>
								{item.count}
							</span>
						</button>
					);
				})}
			</div>

			{/* View switcher */}
			<div className="flex w-full items-center gap-1 rounded-xl border border-border/60 bg-muted/20 p-1 sm:w-auto">
				{viewOptions.map((option) => {
					if (type !== "movie" && option.value === "calendar") {
						return null;
					}

					const Icon = option.icon;
					const isActive = view === option.value;
					return (
						<Tooltip key={`${option.value}_filter`}>
							<TooltipTrigger
								render={
									<Button
										className={cn(
											"h-8 w-8 flex-1 rounded-lg p-0 transition-all duration-300 sm:w-8 sm:flex-none",
											isActive
												? "bg-background text-foreground shadow-sm"
												: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
										)}
										key={option.value}
										onClick={() => setView(option.value)}
										size="icon"
										variant="ghost"
										title={option.label}
									>
										<Icon
											className="size-3.5"
											weight={
												isActive ? "bold" : "regular"
											}
										/>
										<span className="sr-only">
											{option.label}
										</span>
									</Button>
								}
							/>
							<TooltipContent>{option.label}</TooltipContent>
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
}
