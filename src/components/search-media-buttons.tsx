import { useSelector } from "@tanstack/react-store";
import { cn } from "@/lib/utils";
import { searchStore } from "@/store/search-store";

export default function SearchMediaButtons() {
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	const setMediaType = (type: typeof mediaType) => {
		searchStore.setState((state) => ({ ...state, mediaType: type }));
	};

	const options: { value: typeof mediaType; label: string }[] = [
		{ value: "movie", label: "Movies" },
		{ value: "tv", label: "TV" },
		{ value: "anime", label: "Anime" },
		{ value: "manga", label: "Manga" },
		{ value: "book", label: "Books" },
	];

	return (
		<div className="space-y-3">
			<p className="eyebrow tracking-[0.16em]">Select media type</p>
			<div className="flex flex-wrap items-center gap-2">
				{options.map((option) => {
					const isActive = mediaType === option.value;
					return (
						<button
							className={cn(
								"h-9 cursor-pointer rounded-full px-4 text-[13px] font-medium tracking-wide transition-all duration-200",
								isActive
									? "bg-primary text-primary-foreground shadow-soft"
									: "border border-hairline-strong bg-transparent text-muted-foreground hover:border-ink/30 hover:text-ink",
							)}
							key={option.value}
							onClick={() => setMediaType(option.value)}
							type="button"
						>
							{option.label}
						</button>
					);
				})}
			</div>
		</div>
	);
}
