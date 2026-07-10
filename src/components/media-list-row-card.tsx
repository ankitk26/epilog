import type { api } from "@convex/_generated/api";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import MediaTypeIcon from "./media-type-icon";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
	onClick?: () => void;
};

export default function MediaListRowCard({ log, onClick }: Props) {
	return (
		<div
			className="group flex cursor-pointer items-center gap-4 py-4 transition-colors duration-300 ease-out hover:bg-canvas-soft/60"
			onClick={onClick}
			role="button"
		>
			{/* Poster */}
			<div className="aspect-[2/3] w-[5.5rem] flex-shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-border">
				{log.metadata?.image ? (
					<Image
						alt={log.metadata.name || "Media poster"}
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
						height={132}
						src={log.metadata.image || "/placeholder.svg"}
						width={88}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<MediaTypeIcon
							className="size-5 text-muted-foreground/40"
							type={log.metadata.type}
						/>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<h3 className="font-heading text-sm leading-tight font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground">
					{log.metadata?.name || "Untitled"}
				</h3>
				{(log.metadata?.creator ?? log.metadata?.releaseYear) && (
					<p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
						{log.metadata.creator ?? log.metadata.releaseYear}
					</p>
				)}
			</div>
		</div>
	);
}
