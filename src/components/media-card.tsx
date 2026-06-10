import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { PlusIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import IconByType from "./icon-by-type";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Checkbox } from "./ui/checkbox";

type Props = {
	media: {
		imageUrl: string | undefined | null;
		name: string;
		secondaryText?: string | null;
		releaseYear: number | null;
		sourceId: string;
		type: MediaType;
	};
	displayOnly?: boolean;
	id?: Id<"logs">;
	selected?: boolean;
	onToggleSelect?: (id: Id<"logs">) => void;
	showCheckbox?: boolean;
};

export default function MediaCard(props: Props) {
	const { displayOnly = false } = props;
	const [imageFailed, setImageFailed] = useState(false);

	useEffect(() => {
		setImageFailed(false);
	}, [props.media.imageUrl]);

	const addToPlanningMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.addToPlanning),
		onMutate: () => {
			toast.loading("Adding...");
		},
		onSuccess: (response: string) => {
			toast.dismiss();
			toast.success(response);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	const handleAddToPlanning = () => {
		addToPlanningMutation.mutate({
			media: {
				name: props.media.name,
				releaseYear: props.media.releaseYear ?? 2025,
				sourceMediaId: props.media.sourceId,
				type: props.media.type,
				image: props.media.imageUrl ?? "",
			},
		});
	};

	return (
		<Card
			className={cn(
				"group w-full overflow-hidden border-border/40 p-0 transition-all duration-500 hover:border-primary/20 hover:shadow-luxury-lg",
				props.showCheckbox && "cursor-pointer",
				props.selected ? "ring-2 shadow-glow ring-primary/40" : "",
			)}
			onClick={
				props.showCheckbox
					? () => props.id && props.onToggleSelect?.(props.id)
					: undefined
			}
			role={props.showCheckbox ? "button" : undefined}
			aria-pressed={props.showCheckbox ? !!props.selected : undefined}
		>
			<div className="relative aspect-[2/3] overflow-hidden">
				{props.media.imageUrl && !imageFailed ? (
					<Image
						alt={props.media.name}
						className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
						height={176}
						onError={() => setImageFailed(true)}
						src={props.media.imageUrl}
						width={264}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-secondary/50">
						<IconByType
							className="size-16 text-muted-foreground/40"
							type={props.media.type}
						/>
					</div>
				)}
				{/* Checkbox overlay for edit mode */}
				{props.showCheckbox && (
					<div className="absolute top-2 left-2 z-10">
						<Checkbox
							checked={!!props.selected}
							onCheckedChange={() =>
								props.id && props.onToggleSelect?.(props.id)
							}
							onClick={(e) => e.stopPropagation()}
						/>
					</div>
				)}
				{/* Add button overlay */}
				{!displayOnly && !props.showCheckbox && (
					<div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 backdrop-blur-[2px] transition-all duration-500 group-hover:opacity-100">
						<Button
							onClick={handleAddToPlanning}
							size="sm"
							variant="secondary"
							className="rounded-full shadow-luxury-lg transition-transform duration-300 hover:scale-105"
						>
							<PlusIcon className="h-3 w-3" weight="bold" />
							Add
						</Button>
					</div>
				)}
			</div>
			<CardContent className="space-y-0.5 bg-card p-2.5 pt-2">
				<h4 className="line-clamp-2 text-xs leading-snug font-semibold tracking-tight text-foreground">
					{props.media.name}
				</h4>
				{props.media.secondaryText && (
					<p className="line-clamp-1 text-[11px] text-muted-foreground">
						{props.media.secondaryText}
					</p>
				)}
				{props.media.releaseYear && (
					<p className="text-[11px] font-medium text-muted-foreground/70">
						{props.media.releaseYear}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
