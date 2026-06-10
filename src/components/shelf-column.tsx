import type { api } from "@convex/_generated/api";
import type { Icon } from "@phosphor-icons/react";
import type { FunctionReturnType } from "convex/server";
import EmptyStateMessage from "./empty-state-message";
import ShelfCard from "./shelf-card";
import { Badge } from "./ui/badge";

type Props = {
	column: {
		status: string;
		title: string;
		icon: Icon;
	};
	logs: FunctionReturnType<typeof api.logs.all>;
};

export default function ShelfColumn(props: Props) {
	const Icon = props.column.icon;

	return (
		<div className="flex flex-col space-y-2 rounded-xl border border-border/50 bg-muted/20">
			{/* Column Header */}
			<div className="flex items-center justify-between border-b border-border/30 p-3.5">
				<div className="flex items-center gap-2.5">
					<div className="flex size-7 items-center justify-center rounded-lg bg-accent/50">
						<Icon
							className="size-4 text-primary"
							weight="duotone"
						/>
					</div>
					<span className="text-sm font-semibold tracking-tight text-foreground">
						{props.column.title}
					</span>
				</div>
				<Badge
					className="rounded-full border-0 bg-secondary px-2.5 text-xs font-semibold text-secondary-foreground"
					variant="secondary"
				>
					{props.logs.length}
				</Badge>
			</div>

			{/* Column Content */}
			<div className="min-w-0 p-2.5">
				{props.logs.length === 0 && (
					<div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
						<p className="text-xs text-muted-foreground">
							<EmptyStateMessage />
						</p>
					</div>
				)}

				<div className="space-y-2">
					{props.logs.length > 0 &&
						props.logs.map((log) => (
							<ShelfCard key={log._id} log={log} />
						))}
				</div>
			</div>
		</div>
	);
}
