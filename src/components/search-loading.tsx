import { SpinnerIcon } from "@phosphor-icons/react";

export default function SearchLoading() {
	return (
		<div className="flex items-center justify-center gap-2.5 py-12 text-muted-foreground">
			<SpinnerIcon className="size-4 animate-spin" />
			<span className="text-sm tracking-wide">Searching…</span>
		</div>
	);
}
