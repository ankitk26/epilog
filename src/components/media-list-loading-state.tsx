import { Skeleton } from "./ui/skeleton";

export default function MediaListLoadingState() {
	return (
		<div className="space-y-3 pt-4 lg:pt-0">
			{Array.from({ length: 6 }).map((_, index) => (
				<div
					key={`list-skeleton-${index + 1}`}
					className="flex items-center gap-4 rounded-xl border border-border/60 p-3"
				>
					<Skeleton className="h-20 w-14 rounded-lg" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
			))}
		</div>
	);
}
