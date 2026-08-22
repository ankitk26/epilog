import { Skeleton } from "./ui/skeleton";

export default function MediaGridLoadingState() {
	return (
		<div className="grid grid-cols-2 gap-8 pt-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] lg:gap-8 lg:pt-0">
			{Array.from({ length: 12 }).map((_, index) => (
				<div
					key={`grid-skeleton-${index + 1}`}
					className={`flex flex-col ${index >= 10 ? "sm:hidden md:flex" : ""}`}
				>
					<Skeleton className="aspect-[2/3] w-full rounded-lg" />
					<div className="space-y-2 pt-3">
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>
			))}
		</div>
	);
}
