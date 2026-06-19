import type { api } from "@convex/_generated/api";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import IconByType from "./icon-by-type";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
	onClick?: () => void;
};

export default function ListCard({ log, onClick }: Props) {
	return (
		<div
			className="group flex cursor-pointer items-center gap-4 px-2 py-3.5 transition-colors hover:bg-canvas-soft/60"
			onClick={onClick}
			role="button"
		>
			{/* Poster */}
			<div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
				{log.metadata?.image ? (
					<Image
						alt={log.metadata.name || "Media poster"}
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
						height={96}
						src={log.metadata.image || "/placeholder.svg"}
						width={64}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<IconByType
							className="size-5 text-muted-foreground/50"
							type={log.metadata.type}
						/>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<h3 className="font-heading text-base leading-tight font-normal tracking-tight text-ink transition-colors group-hover:text-ink">
					{log.metadata?.name || "Untitled"}
				</h3>
				{log.metadata?.releaseYear && (
					<p className="mt-1 text-xs text-muted-foreground tabular-nums">
						{log.metadata.releaseYear}
					</p>
				)}
			</div>
		</div>
	);
}
