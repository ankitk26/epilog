import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import HomeLoadingSkeleton from "@/components/home-loading-skeleton";
import MainMediaContent from "@/components/main-media-content";
import MediaContentFilters from "@/components/media-content-filters";
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
			<div className="space-y-6">
				<MediaContentFilters />
				<MainMediaContent />
			</div>
		</Suspense>
	);
}
