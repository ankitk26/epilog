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
		<div className="flex flex-col space-y-2.5 rounded-xl border border-hairline bg-canvas-soft/40">
			{/* Column Header */}
			<div className="flex items-center justify-between border-b border-hairline px-3.5 py-3">
				<div className="flex items-center gap-2.5">
					<span className="flex size-7 items-center justify-center rounded-full bg-secondary text-ink">
						<Icon className="size-4" />
					</span>
					<span className="font-heading text-base font-normal tracking-tight text-ink">
						{props.column.title}
					</span>
				</div>
				<span className="text-sm tabular-nums text-muted-foreground">
					{props.logs.length}
				</span>
			</div>

			{/* Column Content */}
			<div className="min-w-0 p-2">
				{props.logs.length === 0 && (
					<div className="flex flex-col items-center justify-center px-3 py-10 text-center">
						<p className="max-w-[14rem] text-[13px] leading-relaxed text-muted-foreground/70">
							<EmptyStateMessage />
						</p>
					</div>
				)}

				<div className="space-y-2.5">
					{props.logs.length > 0 &&
						props.logs.map((log) => (
							<ShelfCard
								key={log._id}
								log={log}
								onClick={() => props.onLogClick?.(log)}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
