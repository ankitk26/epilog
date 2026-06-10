import type { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import IconByType from "./icon-by-type";
import { Checkbox } from "./ui/checkbox";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
	selected?: boolean;
	onToggleSelect?: (id: Id<"logs">) => void;
	showCheckbox?: boolean;
};

export default function ListCard({
	log,
	selected,
	onToggleSelect,
	showCheckbox,
}: Props) {
	return (
		<Card
			className={cn(
				"hover:shadow-luxury-md overflow-hidden border-border/40 p-3.5 transition-all duration-300 hover:border-border/80",
				selected ? "ring-2 shadow-glow ring-primary/40" : "",
			)}
		>
			<div
				aria-pressed={showCheckbox ? !!selected : undefined}
				className="flex items-center gap-3.5"
				onClick={
					showCheckbox ? () => onToggleSelect?.(log._id) : undefined
				}
				role={showCheckbox ? "button" : undefined}
			>
				{/* Selector */}
				{showCheckbox && (
					<Checkbox
						checked={!!selected}
						onCheckedChange={() => onToggleSelect?.(log._id)}
						onClick={(e) => e.stopPropagation()}
					/>
				)}
				{/* Poster */}
				<div className="h-30 w-20 flex-shrink-0 overflow-hidden rounded-lg">
					{log.metadata?.image ? (
						<Image
							alt={log.metadata.name || "Media poster"}
							className="h-full w-full object-cover"
							height={120}
							src={log.metadata.image || "/placeholder.svg"}
							width={80}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center bg-secondary/50">
							<IconByType
								className="size-5 text-muted-foreground/50"
								type={log.metadata.type}
							/>
						</div>
					)}
				</div>

				{/* Content */}
				<div className="min-w-0 flex-1">
					<div className="flex items-start justify-between">
						<div className="space-y-1">
							<h3 className="text-sm leading-tight font-semibold tracking-tight text-foreground">
								{log.metadata?.name || "Untitled"}
							</h3>
							<div className="flex items-center gap-3 text-xs font-medium text-muted-foreground/70">
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
