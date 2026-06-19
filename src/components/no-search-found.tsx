import { useSelector } from "@tanstack/react-store";
import { searchStore } from "@/store/search-store";
import SearchIconByType from "./search-icon-by-type";

export default function NoSearchFound() {
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	return (
		<div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-hairline-strong bg-canvas-soft/50 py-14 text-center">
			<SearchIconByType
				className="size-7 text-muted-foreground/60"
				type={mediaType}
			/>
			<p className="font-heading text-lg font-normal text-ink">
				No results found
			</p>
			<p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
				Try a different search term.
			</p>
		</div>
	);
}
