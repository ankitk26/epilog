import type { api } from "@convex/_generated/api";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { cn } from "@/lib/utils";
import IconByType from "./icon-by-type";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
	onClick?: () => void;
};

export default function ShelfCard({ log, onClick }: Props) {
	return (
		<div
			className={cn(
				"group flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl bg-card p-2.5 ring-1 ring-border transition-all duration-300 hover:shadow-lift hover:ring-hairline-strong",
			)}
			onClick={onClick}
			role={onClick ? "button" : undefined}
		>
			{/* Poster Thumbnail */}
			<div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
				{log.metadata?.image ? (
					<Image
						alt={log.metadata?.name || "Media"}
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
						height={80}
						src={log.metadata.image}
						width={56}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<IconByType
							className="size-4 text-muted-foreground/50"
							type={log.metadata?.type}
						/>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<h4 className="mb-0.5 line-clamp-2 font-heading text-[15px] leading-tight font-normal text-ink">
					{log.metadata.name}
				</h4>
				<p className="text-xs tabular-nums text-muted-foreground">
					{log.metadata.releaseYear}
				</p>
			</div>
		</div>
	);
}
