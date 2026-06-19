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
		{ value: "grid", label: "Grid", icon: SquaresFourIcon },
		{ value: "list", label: "List", icon: ListIcon },
		{ value: "shelf", label: "Shelf", icon: KanbanIcon },
		{ value: "calendar", label: "Calendar", icon: CalendarBlankIcon },
	];

	return (
		<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
			{/* Media type filter — pill rail */}
			<div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap sm:items-center">
				{logCountsByType.map((item) => {
					const isActive = type === item.type;
					return (
						<button
							className={cn(
								"group flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-full border px-4 text-[13px] font-medium tracking-wide transition-all duration-200 sm:w-auto sm:justify-start",
								isActive
									? "border-transparent bg-primary text-primary-foreground shadow-soft"
									: "border-hairline-strong bg-transparent text-muted-foreground hover:border-ink/30 hover:text-ink",
							)}
							key={item.type}
							onClick={() => {
								setType(item.type as MediaType);
							}}
							type="button"
						>
							<span>{item.label}</span>
							<span
								className={cn(
									"flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[11px] leading-none font-semibold tabular-nums",
									isActive
										? "bg-primary-foreground/20 text-primary-foreground"
										: "bg-secondary text-muted-foreground group-hover:bg-secondary",
								)}
							>
								{item.count}
							</span>
						</button>
					);
				})}
			</div>

			{/* View switcher — segmented control */}
			<div className="flex w-full items-center gap-1 rounded-full border border-hairline bg-card/50 p-1 backdrop-blur-sm sm:w-auto">
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
											"h-8 flex-1 gap-1.5 rounded-full px-0 text-[12px] font-medium transition-all duration-200 sm:w-9 sm:flex-none",
											isActive
												? "bg-card text-ink shadow-soft"
												: "text-muted-foreground hover:text-ink",
										)}
										key={option.value}
										onClick={() => setView(option.value)}
										size="sm"
										title={option.label}
										variant="ghost"
									>
										<Icon className="size-4" />
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
