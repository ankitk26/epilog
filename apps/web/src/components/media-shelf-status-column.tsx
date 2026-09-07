import type { api } from "@convex/_generated/api";
import type { Icon } from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import { getBookProgress } from "@/lib/book-progress";
import { toMediaCardMedia } from "@/lib/build-media-card-media";
import MediaCard from "./media-card";

type Props = {
	column: {
		status: string;
		title: string;
		icon: Icon;
	};
	logs: FunctionReturnType<typeof api.logs.all>;
	onLogClick?: (log: FunctionReturnType<typeof api.logs.all>[0]) => void;
};

export default function MediaShelfStatusColumn(props: Props) {
	return (
		<div className="flex min-h-48 flex-col overflow-hidden">
			{/* Column header */}
			<div className="flex items-center justify-center gap-2 py-3">
				<span className="section-label text-center text-foreground/70">
					{props.column.title}
				</span>
				<span className="flex min-w-6 items-center justify-center rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground tabular-nums">
					{props.logs.length}
				</span>
			</div>

			{/* Column Content */}
			<div className="min-w-0 flex-1 py-3">
				{props.logs.length > 0 ? (
					<div className="flex flex-col gap-8">
						{props.logs.map((log) => (
							<MediaCard.Shelf
								key={log._id}
								media={toMediaCardMedia(log)}
								onClick={() => props.onLogClick?.(log)}
								footer={
									<MediaCard.ProgressFooter
										progress={getBookProgress(log)}
									/>
								}
							/>
						))}
					</div>
				) : (
					<div className="flex min-h-24 items-center justify-center px-3 text-center">
						<span className="section-label">No titles</span>
					</div>
				)}
			</div>
		</div>
	);
}
