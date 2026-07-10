import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";

type Props = {
	onChange: (type: MediaType) => void;
	value: MediaType;
};

export default function SearchMediaTypeTabs({ onChange, value }: Props) {
	const mediaType = value;

	const options: { value: typeof mediaType; label: string }[] = [
		{ value: "movie", label: "Movies" },
		{ value: "tv", label: "TV" },
		{ value: "anime", label: "Anime" },
		{ value: "book", label: "Books" },
		{ value: "manga", label: "Manga" },
	];

	return (
		<div className="space-y-3">
			<p className="eyebrow hidden lg:block">Select media type</p>
			<div className="flex flex-wrap items-center gap-2">
				{options.map((option) => {
					const isActive = mediaType === option.value;
					return (
						<button
							className={cn(
								"h-9 cursor-pointer rounded-lg border px-4 text-[11px] font-semibold tracking-wide uppercase transition-all duration-200 lg:h-9",
								isActive
									? "border-transparent bg-primary text-primary-foreground"
									: "border-hairline bg-transparent text-muted-foreground hover:border-hairline-strong hover:text-ink",
							)}
							key={option.value}
							onClick={() => onChange(option.value)}
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
