import { Button } from "@/components/ui/button";
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
		<div className="flex flex-wrap items-center gap-2">
			{options.map((option) => {
				const isActive = mediaType === option.value;
				return (
					<Button
						key={option.value}
						onClick={() => onChange(option.value)}
						size="xs"
						type="button"
						variant={isActive ? "default" : "outline"}
					>
						{option.label}
					</Button>
				);
			})}
		</div>
	);
}
