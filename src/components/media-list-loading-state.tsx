import { Skeleton } from "./ui/skeleton";

function ListRowSkeleton() {
	return (
		<div className="rounded-xl border border-border/70 bg-card p-3 shadow-sm">
			<div className="flex items-center gap-3">
				<Skeleton className="h-30 w-20" />
				<div className="min-w-0 flex-1 space-y-3">
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-3 w-24" />
				</div>
			</div>
		</div>
	);
}

export default function MediaListLoadingState() {
	return (
		<div className="space-y-6 pt-4 lg:pt-0">
			{Array.from({ length: 6 }).map((_, rowIndex) => (
				<ListRowSkeleton key={`list-row-skeleton-${rowIndex + 1}`} />
			))}
		</div>
	);
}
