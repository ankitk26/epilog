import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import MediaTypeBottomBar from "@/components/media-type-bottom-bar";
import MediaViewContent from "@/components/media-view-content";
import MediaViewLoadingState from "@/components/media-view-loading-state";
import MediaViewToolbar from "@/components/media-view-toolbar";
import { mediaFiltersSearchValidator } from "@/lib/media-filters";

export const Route = createFileRoute("/_auth/")({
	validateSearch: mediaFiltersSearchValidator,
	component: Home,
	loader: ({ context }) => {
		void context.queryClient.ensureQueryData(convexQuery(api.logs.all));
	},
});

function Home() {
	return (
		<>
			<Suspense
				fallback={
					<div className="space-y-20">
						<MediaViewLoadingState />
					</div>
				}
			>
				<div className="animate-reveal-fade space-y-6 lg:space-y-8">
					<MediaViewToolbar />
					<MediaViewContent />
					{/* Clearance for the fixed bottom bar on mobile */}
					<div aria-hidden className="h-8 sm:hidden" />
				</div>
			</Suspense>
			<MediaTypeBottomBar />
		</>
	);
}
