import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { inProgressLabel, plannedLabel } from "@/lib/media-labels";
import MediaSectionByStatus from "./media-section-by-status";

export default function ListViewByStatus() {
	const { type: mediaType } = useMediaFilters();

	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	// logs filtered by media type
	const logsFilteredByMediaType = useMemo(
		() => logs.filter((log) => log.metadata.type === mediaType),
		[logs, mediaType],
	);

	const sections = [
		{
			title: plannedLabel(mediaType),
			status: "planned",
		},
		{
			title: inProgressLabel(mediaType),
			status: "in_progress",
		},
		{
			title: "Completed",
			status: "completed",
		},
	];

	return (
		<div className="space-y-12 pt-4 lg:space-y-16 lg:pt-0">
			{sections.map((section) => {
				return (
					<MediaSectionByStatus
						key={section.status}
						logs={logsFilteredByMediaType.filter(
							(log) => log.status === section.status,
						)}
						section={section}
					/>
				);
			})}
		</div>
	);
}
