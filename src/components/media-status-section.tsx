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
		<section className="animate-reveal-up space-y-6">
			{/* Section header — large uppercase title with count */}
			<div className="flex items-end justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="font-heading text-2xl font-medium tracking-tight text-ink lg:text-3xl">
						{props.section.title}
					</h2>
					<span className="eyebrow shrink-0 pl-1 whitespace-nowrap">
						{props.logs.length} titles
					</span>
				</div>
				{props.logs.length > 0 && (
					<Button
						className="text-muted-foreground hover:text-ink"
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
							: "grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] lg:gap-6"
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
									creator: log.metadata.creator,
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
