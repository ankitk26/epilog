import type { api } from "@convex/_generated/api";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { cn } from "@/lib/utils";
import EmptyStateMessage from "./empty-state-message";
import MediaListRowCard from "./media-list-row-card";
import MediaLogDetailsDialog from "./media-log-details-dialog";
import MediaPosterCard from "./media-poster-card";
import { Button } from "./ui/button";

type Props = {
	logs: FunctionReturnType<typeof api.logs.all>;
	section: {
		title: string;
		status: string;
	};
};

export default function MediaSectionByStatus(props: Props) {
	const { view } = useMediaFilters();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [selectedLog, setSelectedLog] = useState<
		FunctionReturnType<typeof api.logs.all>[0] | null
	>(null);

	return (
		<section className="animate-reveal-up space-y-2">
			{/* Section header — editorial title with a hairline rule */}
			<div className="flex items-center gap-4">
				<h2 className="font-heading text-2xl font-light tracking-tight whitespace-nowrap text-ink">
					{props.section.title}
				</h2>
				<span className="text-sm text-muted-foreground tabular-nums">
					{props.logs.length}
				</span>
				<div className="h-px flex-1 bg-hairline" />
				{props.logs.length > 0 && (
					<Button
						className="size-7 shrink-0 rounded-full text-muted-foreground hover:text-ink"
						onClick={() =>
							setIsCollapsed((prevState) => !prevState)
						}
						size="icon"
						variant="ghost"
					>
						<CaretDownIcon
							className={cn(
								"size-4 transition-transform duration-300",
								isCollapsed ? "-rotate-90" : "rotate-0",
							)}
						/>
					</Button>
				)}
			</div>

			{!isCollapsed && props.logs.length !== 0 && (
				<div
					className={
						view === "list"
							? "flex flex-col divide-y divide-hairline border-b border-hairline"
							: "grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-4"
					}
				>
					{props.logs.map((log) =>
						view === "list" ? (
							<MediaListRowCard
								key={log._id}
								log={log}
								onClick={() => setSelectedLog(log)}
							/>
						) : (
							<MediaPosterCard
								displayOnly
								key={log._id}
								media={{
									imageUrl: log.metadata.image,
									name: log.metadata.name || "NA",
									releaseYear: log.metadata.releaseYear,
									sourceId: log.metadata.sourceMediaId,
									type: log.metadata.type,
								}}
								onClick={() => setSelectedLog(log)}
							/>
						),
					)}
				</div>
			)}

			{/* No data section */}
			{props.logs.length === 0 && <EmptyStateMessage />}

			<MediaLogDetailsDialog
				log={selectedLog}
				open={!!selectedLog}
				onOpenChange={(open) => {
					if (!open) setSelectedLog(null);
				}}
			/>
		</section>
	);
}
