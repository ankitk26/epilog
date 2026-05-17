import { Skeleton } from "./ui/skeleton";

function GridCardSkeleton() {
	return (
		<div className="w-full overflow-hidden rounded-xl border bg-card/70">
			<Skeleton className="aspect-2/3 w-full rounded-none" />
			<div className="space-y-2 p-2">
				<Skeleton className="h-3 w-5/6" />
				<Skeleton className="h-3 w-12" />
			</div>
		</div>
	);
}

export default function GridViewSkeleton() {
	return (
		<div className="grid grid-cols-3 gap-3 pt-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-4 lg:pt-0">
			{Array.from({ length: 16 }).map((_, cardIndex) => (
				<GridCardSkeleton key={`grid-card-skeleton-${cardIndex + 1}`} />
			))}
		</div>
	);
}
