import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

type Props = {
	type: MediaType;
};

export default function SearchNoResultsEmptyState({ type: mediaType }: Props) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-canvas-soft/50 py-14 text-center">
			<MediaTypeIcon
				className="size-7 text-muted-foreground/60"
				type={mediaType}
			/>
			<p className="font-heading text-lg font-normal text-foreground">
				No results found
			</p>
			<p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
				Try a different search term.
			</p>
		</div>
	);
}
