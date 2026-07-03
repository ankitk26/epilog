import { useSearch } from "@tanstack/react-router";
import SearchMediaTypeIcon from "./search-media-type-icon";

export default function SearchNoResultsEmptyState() {
	const { type: mediaType } = useSearch({ from: "/_auth/search" });

	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-hairline-strong bg-canvas-soft/50 py-14 text-center">
			<SearchMediaTypeIcon
				className="size-7 text-muted-foreground/60"
				type={mediaType}
			/>
			<p className="font-heading text-lg font-normal text-ink">
				No results found
			</p>
			<p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
				Try a different search term.
			</p>
		</div>
	);
}
