import { Skeleton } from "./ui/skeleton";

export default function SearchResultsLoadingState() {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8 xl:grid-cols-5">
			{Array.from({ length: 12 }).map((_, index) => (
				<div key={index}>
					{/* Mobile: list-style row */}
					<div className="flex items-center gap-4 lg:hidden">
						<Skeleton className="h-20 w-14 shrink-0 rounded-lg" />
						<div className="flex-1 space-y-2">
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-3 w-24" />
						</div>
					</div>

					{/* Desktop: grid-style poster card */}
					<div className="hidden flex-col lg:flex">
						<Skeleton className="aspect-[2/3] w-full rounded-lg" />
						<div className="space-y-2 pt-3">
							<Skeleton className="h-4 w-5/6" />
							<Skeleton className="h-3 w-1/2" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
