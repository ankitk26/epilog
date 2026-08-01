import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import {
	CalendarBlankIcon,
	KanbanIcon,
	SquaresFourIcon,
	ListIcon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FilterMediaView, MediaType } from "@/types";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function MediaViewToolbar() {
	const { setType, setView, type, view } = useMediaFilters();
	const isMobile = useIsMobile();

	useEffect(() => {
		if (isMobile && (view === "grid" || view === "shelf")) {
			setView("list");
		}
	}, [isMobile, setView, view]);

	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	const logCountsByType = [
		{
			type: "movie" as MediaType,
			label: "Movies",
			count: logs.filter((log) => log.metadata.type === "movie").length,
		},
		{
			type: "tv" as MediaType,
			label: "TV Shows",
			count: logs.filter((log) => log.metadata.type === "tv").length,
		},
		{
			type: "anime" as MediaType,
			label: "Anime",
			count: logs.filter((log) => log.metadata.type === "anime").length,
		},
		{
			type: "book" as MediaType,
			label: "Books",
			count: logs.filter((log) => log.metadata.type === "book").length,
		},
		{
			type: "manga" as MediaType,
			label: "Manga",
			count: logs.filter((log) => log.metadata.type === "manga").length,
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

	const currentType = logCountsByType.find((item) => item.type === type);

	return (
		<div className="flex items-center justify-between gap-3">
			{/* Media type — pill buttons on desktop, bottom bar on mobile */}
			<div className="flex flex-1 items-center">
				{/* Mobile: active collection context */}
				<div className="flex items-center gap-2 sm:hidden">
					<span className="section-label">{currentType?.label}</span>
					<span className="flex min-w-5 items-center justify-center bg-secondary px-1 py-1 text-xs leading-none font-semibold text-muted-foreground tabular-nums">
						{currentType?.count}
					</span>
				</div>
				{/* Desktop: pill buttons */}
				<div className="hidden flex-wrap gap-4 sm:flex sm:items-center">
					{logCountsByType.map((item) => {
						const isActive = type === item.type;
						return (
							<Button
								className={cn(
									"group text-xs font-semibold tracking-wide uppercase active:scale-[0.97]",
									isActive
										? "bg-primary! text-primary-foreground hover:text-primary-foreground"
										: "text-muted-foreground hover:text-foreground",
								)}
								key={item.type}
								onClick={() => {
									setType(item.type);
								}}
								size="lg"
								variant="outline"
							>
								{item.label}
								<span
									className={cn(
										"flex min-w-5 items-center justify-center px-1 text-xs leading-none font-semibold tabular-nums",
										isActive
											? "bg-primary-foreground/20 text-primary-foreground"
											: "bg-secondary text-muted-foreground group-hover:text-foreground",
									)}
								>
									{item.count}
								</span>
							</Button>
						);
					})}
				</div>
			</div>

			{/* View switcher — icon buttons */}
			<div
				className={cn(
					"shrink-0 items-center gap-1 border border-border bg-card/50 p-1",
					isMobile && type !== "movie" ? "hidden" : "flex",
				)}
			>
				{viewOptions.map((option) => {
					if (type !== "movie" && option.value === "calendar") {
						return null;
					}

					if (
						isMobile &&
						(option.value === "shelf" || option.value === "grid")
					) {
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
											isActive
												? "bg-card text-foreground shadow-soft"
												: "text-muted-foreground hover:text-foreground",
										)}
										onClick={() => setView(option.value)}
										title={option.label}
										variant="ghost"
										size="icon"
									>
										<Icon />
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
