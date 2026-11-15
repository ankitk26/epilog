import {
	CalendarBlankIcon,
	SquaresFourIcon,
	ListIcon,
} from "@phosphor-icons/react";
import { useEffect } from "react";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { FilterMediaView } from "@/types";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function MediaViewToolbar() {
	const { setView, type, view } = useMediaFilters();
	const isMobile = useIsMobile();

	useEffect(() => {
		if (isMobile && view === "grid") {
			setView("list");
		}

		if (!isMobile && view === "list") {
			setView("grid");
		}
	}, [isMobile, setView, view]);

	const viewOptions: {
		value: FilterMediaView;
		label: string;
		icon: typeof ListIcon;
	}[] = [
		{ value: "grid", label: "Grid", icon: SquaresFourIcon },
		{ value: "list", label: "List", icon: ListIcon },
		{ value: "calendar", label: "Calendar", icon: CalendarBlankIcon },
	];

	const visibleOptions = viewOptions.filter((option) => {
		if (type !== "movie" && option.value === "calendar") {
			return false;
		}

		return !(
			(isMobile && option.value === "grid") ||
			(!isMobile && option.value === "list")
		);
	});

	// A single view leaves nothing to switch between.
	if (visibleOptions.length < 2) {
		return null;
	}

	return (
		<div className="ml-auto flex shrink-0 items-center gap-1">
			{visibleOptions.map((option) => {
				const Icon = option.icon;
				const isActive = view === option.value;
				return (
					<Tooltip key={`${option.value}_filter`}>
						<TooltipTrigger
							render={
								<Button
									className={cn(
										isActive
											? "text-primary-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
									onClick={() => setView(option.value)}
									title={option.label}
									variant={isActive ? "default" : "outline"}
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
	);
}
