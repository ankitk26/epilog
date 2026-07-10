import type { api } from "@convex/_generated/api";
import type { Icon } from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import EmptyStateMessage from "./empty-state-message";
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
		<div className="flex min-h-48 flex-col rounded-lg border border-border bg-canvas-soft/50">
			{/* Column header */}
			<div className="flex items-center gap-3 border-b border-border px-5 py-4">
				<Icon
					className="size-4 text-muted-foreground"
					weight="regular"
				/>
				<span className="font-heading text-sm font-medium tracking-tight text-foreground">
					{props.column.title}
				</span>
				<span className="ml-auto text-xs text-muted-foreground tabular-nums">
					{props.logs.length}
				</span>
			</div>

			{/* Column Content */}
			<div className="min-w-0 flex-1 p-3">
				{props.logs.length === 0 && (
					<div className="px-3 pt-3">
						<EmptyStateMessage />
					</div>
				)}

				{props.logs.length > 0 && (
					<div className="flex flex-col divide-y divide-border/70">
						{props.logs.map((log) => (
							<MediaShelfCard
								key={log._id}
								log={log}
								onClick={() => props.onLogClick?.(log)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
