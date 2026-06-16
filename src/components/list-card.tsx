import type { api } from "@convex/_generated/api";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import IconByType from "./icon-by-type";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
	onClick?: () => void;
};

export default function ListCard({ log, onClick }: Props) {
	return (
		<Card
			className={cn(
				"cursor-pointer p-3 transition-colors hover:bg-muted/50",
				onClick ? "cursor-pointer" : "",
			)}
			onClick={onClick}
			role="button"
		>
			<div className="flex items-center gap-3">
				{/* Poster */}
				<div className="h-30 w-20 flex-shrink-0 overflow-hidden rounded-md">
					{log.metadata?.image ? (
						<Image
							alt={log.metadata.name || "Media poster"}
							className="h-full w-full object-cover"
							height={120}
							src={log.metadata.image || "/placeholder.svg"}
							width={80}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-muted">
							<IconByType
								className="size-5"
								type={log.metadata.type}
							/>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between">
						<div className="space-y-1">
							<h3 className="text-sm leading-tight font-medium">
								{log.metadata?.name || "Untitled"}
							</h3>
							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								{log.metadata?.releaseYear && (
									<span>{log.metadata.releaseYear}</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
