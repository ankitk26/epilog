import type { api } from "@convex/_generated/api";
import type { Icon } from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import EmptyStateMessage from "./empty-state-message";
import ShelfCard from "./shelf-card";

type Props = {
	column: {
		status: string;
		title: string;
		icon: Icon;
	};
	logs: FunctionReturnType<typeof api.logs.all>;
	onLogClick?: (log: FunctionReturnType<typeof api.logs.all>[0]) => void;
};

export default function ShelfColumn(props: Props) {
	const Icon = props.column.icon;

	return (
		<div className="flex min-h-48 flex-col rounded-xl border border-hairline bg-canvas-soft/50">
			{/* Column Header */}
			<div className="flex items-center gap-2.5 border-b border-hairline px-4 py-3.5">
				<Icon className="size-4 text-muted-foreground" weight="regular" />
				<span className="font-heading text-[17px] font-normal tracking-tight text-ink">
					{props.column.title}
				</span>
				<span className="ml-auto text-sm tabular-nums text-muted-foreground">
					{props.logs.length}
				</span>
			</div>

			{/* Column Content */}
			<div className="min-w-0 flex-1 p-1.5">
				{props.logs.length === 0 && (
					<div className="flex flex-1 flex-col items-center justify-center px-3 py-10 text-center">
						<p className="max-w-[14rem] text-[13px] leading-relaxed text-muted-foreground/70">
							<EmptyStateMessage />
						</p>
					</div>
				)}

				{props.logs.length > 0 && (
					<div className="flex flex-col divide-y divide-hairline/70">
						{props.logs.map((log) => (
							<ShelfCard
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
