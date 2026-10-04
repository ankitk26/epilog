import { Skeleton } from "./ui/skeleton";

export default function SearchResultsLoadingState() {
	return (
		<div className="flex flex-col gap-4">
			{Array.from({ length: 8 }).map((_, index) => (
				<div key={index} className="flex items-center gap-4">
					<Skeleton className="aspect-[2/3] w-24 shrink-0 rounded-md" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-1/2" />
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-3 w-16" />
					</div>
				</div>
			))}
		</div>
	);
}
