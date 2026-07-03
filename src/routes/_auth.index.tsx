import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import HomeLoadingState from "@/components/home-loading-state";
import MediaViewContent from "@/components/media-view-content";
import MediaViewToolbar from "@/components/media-view-toolbar";
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
		<Suspense fallback={<HomeLoadingState />}>
			<div className="space-y-20 lg:space-y-20">
				<MediaViewToolbar />
				<MediaViewContent />
			</div>
		</Suspense>
	);
}
