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
				"group flex items-center gap-3 overflow-hidden rounded-lg bg-card p-2.5 transition-all duration-300 hover:shadow-lg",
				onClick && "cursor-pointer hover:bg-muted/50",
			)}
			onClick={onClick}
			role={onClick ? "button" : undefined}
		>
			{/* Poster Thumbnail */}
			<div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-md">
				{log.metadata?.image ? (
					<Image
						alt={log.metadata?.name || "Media"}
						className="h-full w-full object-cover"
						height={80}
						src={log.metadata.image}
						width={56}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-muted">
						<IconByType
							className="size-5 text-muted-foreground"
							type={log.metadata?.type}
						/>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<h4 className="mb-0.5 line-clamp-2 text-sm leading-tight font-semibold text-card-foreground">
					{log.metadata.name}
				</h4>
				<p className="text-xs text-muted-foreground">
					{log.metadata.releaseYear}
				</p>
			</div>
		</div>
	);
}
