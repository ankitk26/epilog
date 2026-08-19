import type { api } from "@convex/_generated/api";
import { CaretDownIcon } from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { useDialogHistory } from "@/hooks/use-dialog-history";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { useIsMobile } from "@/hooks/use-mobile";
import { getBookProgress } from "@/lib/book-progress";
import { cn } from "@/lib/utils";
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
	const isMobile = useIsMobile();
	const effectiveView =
		isMobile && (view === "grid" || view === "shelf")
			? "list"
			: !isMobile && view === "list"
				? "grid"
				: view;

	const [isCollapsed, setIsCollapsed] = useState(false);
	const [selectedLog, setSelectedLog] = useState<
		FunctionReturnType<typeof api.logs.all>[0] | null
	>(null);

	useDialogHistory(!!selectedLog, () => setSelectedLog(null), "log-details");

	return (
		<section className="animate-reveal-up space-y-6">
			{/* Section header — large uppercase title with count */}
			<div className="flex items-end justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="font-heading text-2xl font-light tracking-tight text-foreground lg:text-3xl">
						{props.section.title}
					</h2>
					<span className="section-label shrink-0 pl-1 whitespace-nowrap">
						{props.logs.length} titles
					</span>
				</div>
				{props.logs.length > 0 && (
					<Button
						className="text-muted-foreground fine-hover:hover:text-foreground"
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
						effectiveView === "list"
							? "flex flex-col gap-8"
							: "grid auto-rows-max grid-cols-2 items-start gap-8 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] lg:gap-8"
					}
				>
					{props.logs.map((log) => {
						const progress = getBookProgress(log);

						return effectiveView === "list" ? (
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
								progress={progress}
							/>
						);
					})}
				</div>
			)}

			{/* No data section */}

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
