import { SpinnerIcon } from "@phosphor-icons/react";

export default function SearchResultsLoadingGrid() {
	return (
		<div className="flex items-center justify-center gap-3 py-14 text-muted-foreground">
			<SpinnerIcon className="size-4 animate-spin" />
			<span className="text-sm tracking-wide">Searching…</span>
		</div>
	);
}
