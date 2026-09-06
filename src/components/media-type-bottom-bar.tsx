import { useMediaFilters } from "@/hooks/use-media-filters";
import { useProfileMediaTypes } from "@/hooks/use-profile-media-types";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";
import MediaTypeIcon from "./media-type-icon";
import { Skeleton } from "./ui/skeleton";

const items: { type: MediaType; label: string }[] = [
	{ type: "movie", label: "Movies" },
	{ type: "tv", label: "TV Shows" },
	{ type: "anime", label: "Anime" },
	{ type: "book", label: "Books" },
	{ type: "manga", label: "Manga" },
];

export default function MediaTypeBottomBar() {
	const { type, setType } = useMediaFilters();
	const { enabled: enabledMediaTypes, isReady } = useProfileMediaTypes();

	const visibleItems = items.filter((item) =>
		enabledMediaTypes.includes(item.type),
	);

	return (
		<nav
			aria-label="Media type"
			className="fixed inset-x-0 bottom-0 z-30 rounded-t-xl border-t border-border bg-background/85 shadow-lg backdrop-blur-md backdrop-saturate-150 sm:hidden"
		>
			<div className="flex items-stretch">
				{!isReady
					? Array.from({ length: 5 }).map((_, index) => (
							<div
								className="flex flex-1 flex-col items-center gap-1 py-3"
								key={`media-type-bar-skeleton-${index}`}
							>
								<Skeleton className="size-6 rounded-md" />
								<Skeleton className="h-3 w-8" />
							</div>
						))
					: visibleItems.map((item) => {
							const isActive = type === item.type;
							return (
								<button
									aria-pressed={isActive}
									className="flex flex-1 flex-col items-center gap-1 py-3 active:scale-[0.97]"
									key={item.type}
									onClick={() => setType(item.type)}
									type="button"
								>
									<MediaTypeIcon
										className={cn(
											"size-6",
											isActive
												? "text-foreground"
												: "text-muted-foreground",
										)}
										type={item.type}
										weight={isActive ? "fill" : "regular"}
									/>
									<span
										className={cn(
											"text-xs leading-none font-medium",
											isActive
												? "text-foreground"
												: "text-muted-foreground",
										)}
									>
										{item.label}
									</span>
								</button>
							);
						})}
			</div>
			{/* iOS home-indicator safe area */}
			<div aria-hidden className="h-[env(safe-area-inset-bottom)]" />
		</nav>
	);
}
