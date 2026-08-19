import { Skeleton } from "./ui/skeleton";

function GridCardSkeleton() {
	return (
		<div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-card/85 p-4 shadow-soft">
			<Skeleton className="aspect-[2/3] w-full rounded-xl" />
			<div className="space-y-2 pt-4">
				<Skeleton className="h-3.5 w-5/6" />
				<Skeleton className="h-3 w-1/2" />
			</div>
		</div>
	);
}

export default function MediaGridLoadingState() {
	return (
		<div className="grid grid-cols-2 gap-8 pt-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] lg:gap-8 lg:pt-0">
			{Array.from({ length: 12 }).map((_, cardIndex) => (
				<GridCardSkeleton key={`grid-card-skeleton-${cardIndex + 1}`} />
			))}
		</div>
	);
}
