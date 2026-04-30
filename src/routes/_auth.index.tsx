import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import MainMediaContent from "@/components/main-media-content";
import MediaContentFilters from "@/components/media-content-filters";

export const Route = createFileRoute("/_auth/")({
	component: Home,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(convexQuery(api.logs.all, {}));
	},
});

function Home() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<div className="space-y-6">
				<MediaContentFilters />
				<MainMediaContent />
			</div>
		</Suspense>
	);
}
