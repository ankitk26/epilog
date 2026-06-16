import type { api } from "@convex/_generated/api";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { cn } from "@/lib/utils";
import EmptyStateMessage from "./empty-state-message";
import IconByType from "./icon-by-type";
import ListCard from "./list-card";
import LogDetailsDialog from "./log-details-dialog";
import MediaCard from "./media-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
	logs: FunctionReturnType<typeof api.logs.all>;
	section: {
		title: string;
		status: string;
	};
};

export default function MediaSectionByStatus(props: Props) {
	const { type: mediaType, view } = useMediaFilters();

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [selectedLog, setSelectedLog] = useState<
		FunctionReturnType<typeof api.logs.all>[0] | null
	>(null);

	return (
		<div className="space-y-3">
			{/* Section title */}
			<div className="flex items-center justify-between space-y-1">
				<div className="flex items-center gap-3">
					{/* Collapse button */}
					{props.logs.length > 0 && (
						<Button
							className="size-6"
							onClick={() =>
								setIsCollapsed((prevState) => !prevState)
							}
							size="icon"
							variant="outline"
						>
							<CaretDownIcon
								className={cn(
									"size-3 transition-transform",
									isCollapsed ? "-rotate-90" : "rotate-0",
								)}
							/>
						</Button>
					)}

					<h2 className="font-heading text-lg font-medium">
						{props.section.title}
					</h2>
					<Badge
						className="bg-muted text-muted-foreground"
						variant="secondary"
					>
						{props.logs.length}
					</Badge>
				</div>
			</div>

			{!isCollapsed && props.logs.length !== 0 && (
				<div
					className={
						view === "list"
							? "flex flex-col gap-4"
							: "grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] lg:gap-4"
					}
				>
					{props.logs.map((log) =>
						view === "list" ? (
							<ListCard
								key={log._id}
								log={log}
								onClick={() => setSelectedLog(log)}
							/>
						) : (
							<MediaCard
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
			{props.logs.length === 0 && (
				<div className="flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-dashed border-muted-foreground/25 py-8 text-center">
					<IconByType
						className="size-8 text-muted-foreground"
						type={mediaType}
					/>
					<p className="text-xs text-muted-foreground">
						<EmptyStateMessage />
					</p>
				</div>
			)}

			<LogDetailsDialog
				log={selectedLog}
				open={!!selectedLog}
				onOpenChange={(open) => {
					if (!open) setSelectedLog(null);
				}}
			/>
		</div>
	);
}
