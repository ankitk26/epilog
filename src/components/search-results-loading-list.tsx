import { Skeleton } from "./ui/skeleton";

export default function SearchResultsLoadingList() {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8 xl:grid-cols-5">
			{Array.from({ length: 12 }).map((_, index) => (
				<div key={index}>
					<div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card px-3 py-3 shadow-sm lg:hidden">
						<Skeleton className="h-20 w-16 flex-shrink-0" />
						<div className="min-w-0 flex-1 space-y-2">
							<Skeleton className="h-4 w-2/3" />
							<Skeleton className="h-3 w-1/3" />
						</div>
					</div>

					<div className="hidden overflow-hidden rounded-2xl border border-border/70 bg-card p-3 shadow-sm lg:block">
						<Skeleton className="aspect-[2/3] w-full rounded-xl" />
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
