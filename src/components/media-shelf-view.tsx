import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import {
	CalendarBlankIcon,
	CheckCircleIcon,
	ClockIcon,
	EyeIcon,
	XCircleIcon,
	type Icon,
} from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import { useMemo, useRef, useState } from "react";
import { useDialogHistory } from "@/hooks/use-dialog-history";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { statusLabel } from "@/lib/media-labels";
import { statusesByMediaType } from "@/types";
import type { LogStatus } from "@/types";
import MediaLogDetailsDialog from "./media-log-details-dialog";
import MediaShelfStatusColumn from "./media-shelf-status-column";

const iconByStatus: Record<LogStatus, Icon> = {
	tbr: CalendarBlankIcon,
	reading: ClockIcon,
	finished: CheckCircleIcon,
	dnf: XCircleIcon,
	watchlist: CalendarBlankIcon,
	watching: EyeIcon,
	watched: CheckCircleIcon,
	plan_to_watch: CalendarBlankIcon,
	waiting: ClockIcon,
	completed: CheckCircleIcon,
	dropped: XCircleIcon,
};

export default function MediaShelfView() {
	const { type: mediaType } = useMediaFilters();

	const [activeTab, setActiveTab] = useState(0);
	const [touchStart, setTouchStart] = useState(0);
	const [touchEnd, setTouchEnd] = useState(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const [selectedLog, setSelectedLog] = useState<
		FunctionReturnType<typeof api.logs.all>[0] | null
	>(null);

	useDialogHistory(
		!!selectedLog,
		() => setSelectedLog(null),
		"shelf-log-details",
	);

	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	const columns = statusesByMediaType[mediaType].map((status) => ({
		status,
		title: statusLabel(status, mediaType),
		icon: iconByStatus[status],
	}));

	// logs filtered by media type
	const logsFilteredByMediaType = useMemo(
		() => logs.filter((log) => log.metadata.type === mediaType),
		[logs, mediaType],
	);

	// Swipe functionality
	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStart(e.targetTouches[0].clientX);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEnd(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = (e?: React.TouchEvent) => {
		const endX = touchEnd || e?.changedTouches?.[0]?.clientX || 0;
		if (!(touchStart && endX)) {
			setTouchStart(0);
			setTouchEnd(0);
			return;
		}

		const distance = touchStart - endX;
		const isLeftSwipe = distance > 50;
		const isRightSwipe = distance < -50;

		if (isLeftSwipe && activeTab < columns.length - 1) {
			setActiveTab(activeTab + 1);
		} else if (isRightSwipe && activeTab > 0) {
			setActiveTab(activeTab - 1);
		}

		setTouchStart(0);
		setTouchEnd(0);
	};

	return (
		<div className="-mx-6 space-y-8 overflow-x-hidden lg:mx-0">
			{/* Mobile and tablet: Single column with swipe */}
			<div
				className="lg:hidden"
				onTouchEnd={handleTouchEnd}
				onTouchMove={handleTouchMove}
				onTouchStart={handleTouchStart}
				ref={containerRef}
			>
				<div
					className="flex transition-transform duration-300 ease-in-out will-change-transform"
					style={{
						width: `${columns.length * 100}vw`,
						transform: `translateX(-${activeTab * 100}vw)`,
					}}
				>
					{columns.map((column) => (
						<div
							className="w-[100vw] max-w-[100vw] shrink-0 px-6"
							key={column.status}
						>
							<MediaShelfStatusColumn
								column={column}
								logs={logsFilteredByMediaType.filter(
									(log) => log.status === column.status,
								)}
								onLogClick={setSelectedLog}
							/>
						</div>
					))}
				</div>
			</div>

			{/* Desktop: multi-column grid */}
			<div
				className="hidden gap-6 lg:grid lg:items-start"
				style={{
					gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
				}}
			>
				{columns.map((column) => (
					<MediaShelfStatusColumn
						column={column}
						key={column.status}
						logs={logsFilteredByMediaType.filter(
							(log) => log.status === column.status,
						)}
						onLogClick={setSelectedLog}
					/>
				))}
			</div>

			<MediaLogDetailsDialog
				log={selectedLog}
				open={!!selectedLog}
				onOpenChange={(open) => {
					if (!open) setSelectedLog(null);
				}}
			/>
		</div>
	);
}
