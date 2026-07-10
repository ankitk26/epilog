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
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { FilterMediaView, MediaType } from "@/types";
import { Button } from "./ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function MediaViewToolbar() {
	const { setType, setView, type, view } = useMediaFilters();
	const isMobile = useIsMobile();

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
			{/* Media type — pill buttons on desktop, select on mobile */}
			<div className="flex flex-1 items-center">
				{/* Desktop: pill buttons */}
				<div className="hidden flex-wrap gap-4 sm:flex sm:items-center">
					{logCountsByType.map((item) => {
						const isActive = type === item.type;
						return (
							<button
								className={cn(
									"group flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 text-xs font-semibold tracking-wide uppercase transition-all duration-200 active:scale-[0.97]",
									isActive
										? "border-transparent bg-primary text-primary-foreground"
										: "border-hairline bg-transparent text-muted-foreground hover:border-hairline-strong hover:text-ink",
								)}
								key={item.type}
								onClick={() => {
									setType(item.type);
								}}
								type="button"
							>
								{item.label}
								<span
									className={cn(
										"flex min-w-[1.25rem] items-center justify-center rounded-lg px-1 text-xs leading-none font-semibold tabular-nums",
										isActive
											? "bg-primary-foreground/20 text-primary-foreground"
											: "bg-secondary text-muted-foreground group-hover:text-ink",
									)}
								>
									{item.count}
								</span>
							</button>
						);
					})}
				</div>

				{/* Mobile: select */}
				<div className="flex sm:hidden">
					<Select
						value={type}
						onValueChange={(value) => setType(value as MediaType)}
					>
						<SelectTrigger className="h-8 gap-1.5 border-hairline bg-canvas-soft px-2 text-xs">
							<SelectValue>
								{currentType && (
									<span className="flex items-center gap-2">
										{currentType.label}
										<span className="flex min-w-[1.25rem] items-center justify-center rounded-md bg-secondary px-1 text-xs font-semibold text-muted-foreground tabular-nums">
											{currentType.count}
										</span>
									</span>
								)}
							</SelectValue>
						</SelectTrigger>
						<SelectContent align="start">
							{logCountsByType.map((item) => (
								<SelectItem key={item.type} value={item.type}>
									<span className="flex flex-1 items-center justify-between gap-3">
										{item.label}
										<span className="flex min-w-[1.25rem] items-center justify-center rounded-md bg-secondary px-1 text-xs font-semibold text-muted-foreground tabular-nums">
											{item.count}
										</span>
									</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* View switcher — icon buttons */}
			<div className="flex shrink-0 items-center gap-1 rounded-lg border border-hairline bg-card/50 p-1">
				{viewOptions.map((option) => {
					if (type !== "movie" && option.value === "calendar") {
						return null;
					}

					if (isMobile && option.value === "shelf") {
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
											"size-7 sm:size-8",
											isActive
												? "bg-card text-ink shadow-soft"
												: "text-muted-foreground hover:text-ink",
										)}
										onClick={() => setView(option.value)}
										title={option.label}
										variant="ghost"
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
