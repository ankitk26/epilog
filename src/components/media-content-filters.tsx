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

const mediaNouns: { type: MediaType; word: string }[] = [
	{ type: "movie", word: "films" },
	{ type: "tv", word: "shows" },
	{ type: "anime", word: "anime" },
	{ type: "book", word: "books" },
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

export default function LibraryMasthead() {
	const { setType, setView, type, view } = useMediaFilters();

	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	const countByType = (t: MediaType) =>
		logs.filter((log) => log.metadata.type === t).length;

	return (
		<div className="space-y-7">
			<p className="eyebrow animate-reveal-fade tracking-[0.18em]">
				The Library
			</p>

			{/* Integrated headline — the media-type words ARE the filter */}
			<h1
				key={type}
				className="display animate-reveal-up flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[2.5rem] leading-[1.1] text-ink sm:text-5xl lg:text-6xl"
			>
				<span>The</span>
				<span className="inline-flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
					{mediaNouns.map((noun, i) => {
						const isActive = type === noun.type;
						const count = countByType(noun.type);
						return (
							<span
								key={noun.type}
								className="inline-flex items-baseline"
							>
								{i > 0 && (
									<span className="mr-2.5 text-muted-foreground/40">
										/
									</span>
								)}
								<button
									className={cn(
										"group relative cursor-pointer font-heading italic font-light tracking-tight transition-colors duration-200",
										isActive
											? "text-ink"
											: "text-muted-foreground/55 hover:text-ink/80",
									)}
									onClick={() => setType(noun.type)}
									type="button"
								>
									<span
										className={cn(
											"bg-gradient-to-b from-transparent bg-[length:100%_2px] bg-bottom bg-no-repeat pb-0.5 transition-all duration-300",
											isActive
												? "bg-[linear-gradient(var(--ink),var(--ink))] bg-[length:100%_1px]"
												: "bg-[length:0%_1px] group-hover:bg-[linear-gradient(var(--ink),var(--ink))] group-hover:bg-[length:100%_1px]",
										)}
									>
										{noun.word}
									</span>
									<sup className="ml-0.5 align-super font-sans text-[0.4em] not-italic font-semibold tabular-nums text-muted-foreground/70">
										{count}
									</sup>
								</button>
							</span>
						);
					})}
				</span>
				<span>you keep.</span>
			</h1>

			{/* View switcher — quiet, right-aligned with a hairline rule */}
			<div className="flex items-center gap-4">
				<div className="h-px flex-1 bg-hairline" />
				<div className="flex items-center gap-1 rounded-full border border-hairline bg-card/50 p-1 backdrop-blur-sm">
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
												"h-8 w-9 gap-1.5 rounded-full px-0 text-[12px] font-medium transition-all duration-200",
												isActive
													? "bg-card text-ink shadow-soft"
													: "text-muted-foreground hover:text-ink",
											)}
											key={option.value}
											onClick={() =>
												setView(option.value)
											}
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
								<TooltipContent>
									{option.label}
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</div>
		</div>
	);
}
