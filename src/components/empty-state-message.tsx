import { useMediaFilters } from "@/hooks/use-media-filters";
import type { MediaType } from "@/types";
import IconByType from "./icon-by-type";

const messageByType: Record<MediaType, string> = {
	movie: "No films here yet.",
	tv: "No shows here yet.",
	anime: "No anime here yet.",
	book: "No books here yet.",
};

export default function EmptyStateMessage() {
	const { type: mediaType } = useMediaFilters();

	return (
		<div className="flex items-center gap-2.5 py-3 text-muted-foreground/70">
			<IconByType className="size-4 shrink-0" type={mediaType} />
			<span className="text-[13px] leading-relaxed">
				{messageByType[mediaType]}
			</span>
		</div>
	);
}
