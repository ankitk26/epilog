import { cn } from "@/lib/utils";

export type BookProgressData = {
	percent: number;
	read: number;
	total: number;
};

type Props = {
	progress: BookProgressData;
	className?: string;
};

/**
 * A quiet progress line: one continuous bar and the percentage at the edge.
 */
export default function BookProgress({ progress, className }: Props) {
	const percent = Math.min(100, Math.max(0, progress.percent));

	return (
		<div className={cn("flex max-w-48 items-center gap-2", className)}>
			<div
				aria-label={`Reading progress ${percent}%`}
				className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-secondary"
				role="progressbar"
				aria-valuemax={100}
				aria-valuemin={0}
				aria-valuenow={percent}
			>
				<span
					className="block h-full rounded-full bg-primary transition-[width] duration-500"
					style={{ width: `${percent}%` }}
				/>
			</div>
			<span className="shrink-0 text-[10px] font-semibold text-muted-foreground tabular-nums">
				{percent}%
			</span>
		</div>
	);
}
