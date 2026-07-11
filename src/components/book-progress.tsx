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
 * Reading progress visualized as a row of page-edge segments.
 * Read segments stand tall in the accent color, remaining pages sit short
 * and muted — reading progress reads like the side of a book's pages.
 */
export default function BookProgress({ progress, className }: Props) {
	const filledSegments = Math.round(progress.percent / 10);

	return (
		<div className={cn("flex flex-col gap-1", className)}>
			<div className="flex items-baseline justify-between">
				<span className="font-heading text-xs font-medium text-foreground tabular-nums">
					{progress.percent}%
				</span>
				<span className="text-xs text-muted-foreground tabular-nums">
					{progress.read} / {progress.total}
				</span>
			</div>

			<div
				aria-label={`Reading progress ${progress.percent}%`}
				className="flex items-end gap-1"
				role="img"
			>
				{Array.from({ length: 10 }, (_, i) => {
					const filled = i < filledSegments;
					return (
						<span
							className={cn(
								"w-1 rounded-full transition-all duration-500 ease-out",
								filled ? "h-2 bg-primary" : "h-1 bg-secondary",
							)}
							key={i}
						/>
					);
				})}
			</div>
		</div>
	);
}
