import { useSelector } from "@tanstack/react-store";
import { cn } from "@/lib/utils";
import { searchStore } from "@/store/search-store";
import { Button } from "./ui/button";

export default function SearchMediaButtons() {
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	const setMediaType = (type: typeof mediaType) => {
		searchStore.setState((state) => ({ ...state, mediaType: type }));
	};

	const options = [
		{ type: "anime" as const, label: "Anime" },
		{ type: "tv" as const, label: "TV" },
		{ type: "movie" as const, label: "Movies" },
		{ type: "book" as const, label: "Books" },
	];

	return (
		<div className="flex flex-col space-y-3">
			<p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
				Select media type
			</p>
			<div className="flex flex-wrap items-center gap-2">
				{options.map((option) => (
					<Button
						className={cn(
							"h-9 rounded-full border px-4 text-xs font-semibold transition-all duration-300",
							mediaType === option.type
								? "border-primary/30 bg-primary text-primary-foreground shadow-sm hover:bg-primary/85"
								: "border-border/60 bg-card text-muted-foreground hover:bg-accent/40 hover:text-foreground",
						)}
						key={option.type}
						onClick={() => setMediaType(option.type)}
						size="sm"
						variant="outline"
					>
						{option.label}
					</Button>
				))}
			</div>
		</div>
	);
}
