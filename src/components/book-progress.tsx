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
		<div className={cn("flex max-w-48 flex-col gap-2", className)}>
			<div className="flex items-baseline justify-between gap-3">
				<span className="font-heading text-xs font-semibold text-foreground tabular-nums">
					{progress.percent}% ({progress.read}/{progress.total})
				</span>
			</div>

			<div
				aria-label={`Reading progress ${progress.percent}%`}
				className="flex h-1.5 w-full gap-1 rounded-full"
				role="img"
			>
				{Array.from({ length: 10 }, (_, i) => (
					<span
						className={cn(
							"h-full flex-1 rounded-full transition-colors duration-500",
							i < filledSegments ? "bg-primary" : "bg-secondary",
						)}
						key={i}
					/>
				))}
			</div>
		</div>
	);
}
