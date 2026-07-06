import type { api } from "@convex/_generated/api";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import MediaTypeIcon from "./media-type-icon";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
	onClick?: () => void;
};

export default function MediaShelfCard({ log, onClick }: Props) {
	return (
		<div
			className="group flex cursor-pointer items-center gap-3 overflow-hidden rounded-lg px-3 py-3 transition-all duration-200 hover:translate-x-0.5 hover:bg-card"
			onClick={onClick}
			role={onClick ? "button" : undefined}
		>
			{/* Poster Thumbnail */}
			<div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
				{log.metadata?.image ? (
					<Image
						alt={log.metadata?.name || "Media"}
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
						height={96}
						src={log.metadata.image}
						width={64}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<MediaTypeIcon
							className="size-5 text-muted-foreground/50"
							type={log.metadata?.type}
						/>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<h4 className="mb-1 line-clamp-2 font-heading text-sm leading-tight font-normal text-ink">
					{log.metadata.name}
				</h4>
				<p className="line-clamp-1 text-xs text-muted-foreground">
					{log.metadata.creator ?? log.metadata.releaseYear}
				</p>
			</div>
		</div>
	);
}
