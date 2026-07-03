import { useMediaFilters } from "@/hooks/use-media-filters";
import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

const messageByType: Record<MediaType, string> = {
	movie: "No films here yet.",
	tv: "No shows here yet.",
	anime: "No anime here yet.",
	book: "No books here yet.",
	manga: "No manga here yet.",
};

export default function EmptyStateMessage() {
	const { type: mediaType } = useMediaFilters();

	return (
		<div className="flex items-center gap-3 py-6 text-muted-foreground/70">
			<MediaTypeIcon className="size-4 shrink-0" type={mediaType} />
			<span className="text-sm leading-relaxed">
				{messageByType[mediaType]}
			</span>
		</div>
	);
}
