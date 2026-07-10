import { Skeleton } from "./ui/skeleton";

export default function SearchResultsLoadingList() {
	return (
		<div className="flex flex-col gap-1">
			{Array.from({ length: 6 }).map((_, index) => (
				<div
					className="flex items-center gap-4 rounded-lg px-3 py-3"
					key={index}
				>
					<Skeleton className="h-16 w-12 flex-shrink-0 rounded-md lg:h-32 lg:w-24 lg:rounded-lg" />
					<div className="min-w-0 flex-1 space-y-2">
						<Skeleton className="h-4 w-2/3" />
						<Skeleton className="h-3 w-1/3" />
					</div>
				</div>
			))}
		</div>
	);
}
