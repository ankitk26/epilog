import type { api } from "@convex/_generated/api";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import IconByType from "./icon-by-type";
import ShelfCardActions from "./shelf-card-actions";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
};

export default function ShelfCard({ log }: Props) {
	return (
		<div className="group hover:shadow-luxury-md flex items-center gap-3.5 overflow-hidden rounded-xl border border-transparent bg-card p-2.5 transition-all duration-300 hover:border-border/60">
			{/* Poster Thumbnail */}
			<div className="h-22 w-15 flex-shrink-0 overflow-hidden rounded-lg">
				{log.metadata?.image ? (
					<Image
						alt={log.metadata?.name || "Media"}
						className="h-full w-full object-cover"
						height={88}
						src={log.metadata.image}
						width={60}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-secondary/50">
						<IconByType
							className="size-5 text-muted-foreground/50"
							type={log.metadata?.type}
						/>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<h4 className="mb-0.5 line-clamp-2 text-sm leading-tight font-semibold tracking-tight text-card-foreground">
					{log.metadata.name}
				</h4>
				<p className="text-xs font-medium text-muted-foreground/70">
					{log.metadata.releaseYear}
				</p>
			</div>

			{/* Actions */}
			<div className="flex-shrink-0 self-start opacity-0 transition-opacity duration-200 group-hover:opacity-100">
				<ShelfCardActions log={log} />
			</div>
		</div>
	);
}
