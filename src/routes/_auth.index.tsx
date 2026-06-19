import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import HomeLoadingSkeleton from "@/components/home-loading-skeleton";
import LibraryMasthead from "@/components/media-content-filters";
import MainMediaContent from "@/components/main-media-content";
import { mediaFiltersSearchValidator } from "@/lib/media-filters";

export const Route = createFileRoute("/_auth/")({
	validateSearch: mediaFiltersSearchValidator,
	component: Home,
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(convexQuery(api.logs.all));
	},
});

function Home() {
	return (
		<Suspense fallback={<HomeLoadingSkeleton />}>
			<div className="space-y-12 pt-2 lg:space-y-16 lg:pt-4">
				<LibraryMasthead />
				<MainMediaContent />
			</div>
		</Suspense>
	);
}
