import { Skeleton } from "./ui/skeleton";

function MediaShelfCardSkeleton() {
	return (
		<div className="flex flex-col">
			<Skeleton className="aspect-[2/3] w-full max-w-28 rounded-lg" />
			<div className="space-y-2 pt-3">
				<Skeleton className="h-4 w-5/6" />
				<Skeleton className="h-3 w-1/2" />
			</div>
		</div>
	);
}

function MediaShelfStatusColumnSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<MediaShelfCardSkeleton />
			<MediaShelfCardSkeleton />
			<MediaShelfCardSkeleton />
		</div>
	);
}

export default function MediaShelfLoadingState() {
	return (
		<div className="-mx-4 space-y-6 overflow-x-hidden lg:mx-0">
			<div className="px-4 lg:hidden">
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
