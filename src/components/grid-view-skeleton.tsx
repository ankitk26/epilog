import { Skeleton } from "./ui/skeleton";

function GridCardSkeleton() {
	return (
		<div className="w-full max-w-44 overflow-hidden rounded-xl border bg-card/70">
			<Skeleton className="aspect-[2/3] w-full rounded-none" />
			<div className="space-y-2 p-2">
				<Skeleton className="h-3 w-5/6" />
				<Skeleton className="h-3 w-12" />
			</div>
		</div>
	);
}

export default function GridViewSkeleton() {
	return (
		<div className="grid grid-cols-3 gap-4 pt-4 lg:grid-cols-8 lg:pt-0">
			{Array.from({ length: 16 }).map((_, cardIndex) => (
				<GridCardSkeleton key={`grid-card-skeleton-${cardIndex + 1}`} />
			))}
		</div>
	);
}
