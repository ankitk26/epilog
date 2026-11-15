import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { useDialogHistory } from "@/hooks/use-dialog-history";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { useIsMobile } from "@/hooks/use-mobile";
import { getBookProgress } from "@/lib/book-progress";
import { toMediaCardMedia } from "@/lib/build-media-card-media";
import MediaCard from "./media-card";
import MediaLogDetailsDialog from "./media-log-details-dialog";

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
		isMobile && view === "grid"
			? "list"
			: !isMobile && view === "list"
				? "grid"
				: view;

	const [selectedLog, setSelectedLog] = useState<
		FunctionReturnType<typeof api.logs.all>[0] | null
	>(null);

	useDialogHistory(!!selectedLog, () => setSelectedLog(null), "log-details");

	return (
		<section className="animate-reveal-up">
			{props.logs.length === 0 && (
				<p className="text-xs text-muted-foreground">
					Nothing here yet
				</p>
			)}
			<div
				className={
					effectiveView === "list"
						? "flex flex-col gap-4 sm:gap-8"
						: "grid auto-rows-max grid-cols-2 items-start gap-8 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] lg:gap-8"
				}
			>
				{props.logs.map((log) => {
					const progress = getBookProgress(log);

					return effectiveView === "list" ? (
						<MediaCard.List
							key={log._id}
							media={toMediaCardMedia(log)}
							onClick={() => setSelectedLog(log)}
							footer={
								<MediaCard.ProgressFooter progress={progress} />
							}
						/>
					) : (
						<MediaCard.Grid
							key={log._id}
							media={toMediaCardMedia(log)}
							onClick={() => setSelectedLog(log)}
							footer={
								<MediaCard.ProgressFooter progress={progress} />
							}
						/>
					);
				})}
			</div>

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
