import type { api } from "@convex/_generated/api";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { getBookProgress } from "@/lib/book-progress";
import BookProgress from "./book-progress";
import MediaTypeIcon from "./media-type-icon";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
	onClick?: () => void;
};

export default function MediaListRowCard({ log, onClick }: Props) {
	const progress = getBookProgress(log);

	return (
		<div
			className="group flex cursor-pointer items-center gap-6 rounded-xl bg-card px-4 py-3 shadow-soft transition-all duration-300 ease-out hover:shadow-lift hover:ring-2 hover:ring-border focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
			onClick={onClick}
			role="button"
		>
			{/* Poster */}
			<div className="aspect-[2/3] w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-soft ring-1 ring-border/70">
				{log.metadata?.image ? (
					<Image
						alt={log.metadata.name || "Media poster"}
						className="h-full w-full object-cover"
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
			<div className="flex min-w-0 flex-1 flex-col gap-3">
				<h3 className="font-heading text-sm leading-tight font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground">
					{log.metadata?.name || "Untitled"}
				</h3>
				{(log.metadata?.creator ?? log.metadata?.releaseYear) && (
					<p className="line-clamp-1 text-xs text-muted-foreground">
						{log.metadata.creator ?? log.metadata.releaseYear}
					</p>
				)}
				{progress && <BookProgress progress={progress} />}
			</div>
		</div>
	);
}
