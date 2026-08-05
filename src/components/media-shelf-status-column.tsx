import type { api } from "@convex/_generated/api";
import type { Icon } from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import MediaShelfCard from "./media-shelf-card";

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
	const Icon = props.column.icon;

	return (
		<div className="flex min-h-48 flex-col overflow-hidden rounded-xl border border-border/70 bg-card/70 shadow-soft">
			{/* Column header */}
			<div className="flex items-center gap-3 border-b border-border/70 bg-card/60 px-4 py-3">
				<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
					<Icon className="size-4" weight="regular" />
				</div>
				<span className="section-label text-foreground/70">
					{props.column.title}
				</span>
				<span className="ml-auto flex min-w-6 items-center justify-center rounded-full bg-secondary px-2 py-1 text-xs font-semibold text-muted-foreground tabular-nums">
					{props.logs.length}
				</span>
			</div>

			{/* Column Content */}
			<div className="min-w-0 flex-1 p-3">
				{props.logs.length > 0 ? (
					<div className="flex flex-col gap-2">
						{props.logs.map((log) => (
							<MediaShelfCard
								key={log._id}
								log={log}
								onClick={() => props.onLogClick?.(log)}
							/>
						))}
					</div>
				) : (
					<div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-border/70 px-3 text-center">
						<span className="section-label">No titles</span>
					</div>
				)}
			</div>
		</div>
	);
}
