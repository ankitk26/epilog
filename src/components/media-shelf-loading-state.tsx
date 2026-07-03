import { Skeleton } from "./ui/skeleton";

function MediaShelfCardSkeleton() {
	return (
		<div className="flex items-center gap-3 overflow-hidden rounded-lg bg-card/70 p-3">
			<Skeleton className="h-20 w-14 rounded-md" />
			<div className="min-w-0 flex-1 space-y-3">
				<Skeleton className="h-4 w-4/5" />
				<Skeleton className="h-3 w-16" />
			</div>
			<Skeleton className="h-6 w-6 rounded-full" />
		</div>
	);
}

function MediaShelfStatusColumnSkeleton() {
	return (
		<div className="flex flex-col space-y-2 rounded-lg border border-border/50 bg-muted/30">
			<div className="space-y-3 p-2">
				{Array.from({ length: 3 }).map((_, index) => (
					<MediaShelfCardSkeleton
						key={`media-shelf-card-skeleton-${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}

export default function MediaShelfLoadingState() {
	return (
		<div className="-mx-4 space-y-6 overflow-x-hidden lg:mx-0">
			<div className="space-y-6 px-4 lg:hidden">
				<MediaShelfStatusColumnSkeleton />
			</div>

			<div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
				{Array.from({ length: 3 }).map((_, index) => (
					<MediaShelfStatusColumnSkeleton
						key={`media-shelf-status-column-skeleton-${index + 1}`}
					/>
				))}
			</div>
		</div>
	);
}
