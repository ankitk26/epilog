import { SpinnerIcon } from "@phosphor-icons/react";

export default function SearchLoading() {
	return (
		<div className="flex items-center justify-center py-8">
			<div className="flex items-center gap-2 text-muted-foreground">
				<SpinnerIcon className="h-4 w-4 animate-spin" />
				<span className="text-sm">Searching...</span>
			</div>
		</div>
	);
}
