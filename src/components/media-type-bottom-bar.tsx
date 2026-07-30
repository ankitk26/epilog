import { useMediaFilters } from "@/hooks/use-media-filters";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

const items: { type: MediaType; label: string }[] = [
	{ type: "movie", label: "Movies" },
	{ type: "tv", label: "TV Shows" },
	{ type: "anime", label: "Anime" },
	{ type: "book", label: "Books" },
	{ type: "manga", label: "Manga" },
];

export default function MediaTypeBottomBar() {
	const { type, setType } = useMediaFilters();

	return (
		<nav
			aria-label="Media type"
			className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-canvas/80 backdrop-blur-md backdrop-saturate-150 sm:hidden"
		>
			<div className="flex items-stretch">
				{items.map((item) => {
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
