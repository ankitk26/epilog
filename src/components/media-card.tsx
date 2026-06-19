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

type Props = {
	media: {
		imageUrl: string | undefined | null;
		name: string;
		secondaryText?: string | null;
		releaseYear: number | null;
		sourceId: string;
		type: MediaType;
		seriesName?: string;
		seriesPosition?: number;
		seriesTotal?: number;
		seriesKey?: string;
	};
	displayOnly?: boolean;
	id?: Id<"logs">;
	onClick?: () => void;
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
				seriesName: props.media.seriesName,
				seriesPosition: props.media.seriesPosition,
				seriesTotal: props.media.seriesTotal,
				seriesKey: props.media.seriesKey,
			},
		});
	};

	const isClickable = displayOnly && !!props.onClick;

	return (
		<Card
			className={cn(
				"group w-full overflow-hidden rounded-xl p-0 ring-1 ring-border transition-all duration-300",
				isClickable &&
					"cursor-pointer hover:shadow-lift hover:ring-hairline-strong",
			)}
			onClick={props.onClick}
			role={isClickable ? "button" : undefined}
		>
			<div className="relative aspect-[2/3] overflow-hidden rounded-t-xl bg-muted">
				{props.media.imageUrl && !imageFailed ? (
					<Image
						alt={props.media.name}
						className={cn(
							"h-full w-full object-cover object-top transition-transform duration-700 ease-out",
							!displayOnly && "group-hover:scale-[1.04]",
						)}
						height={176}
						onError={() => setImageFailed(true)}
						src={props.media.imageUrl}
						width={264}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-secondary">
						<IconByType
							className="size-14 text-muted-foreground/50"
							type={props.media.type}
						/>
					</div>
				)}
				{/* Add button overlay */}
				{!displayOnly && (
					<div className="absolute inset-0 flex items-center justify-center bg-ink/45 opacity-0 backdrop-blur-[3px] transition-opacity duration-300 group-hover:opacity-100">
						<Button
							className="h-9 gap-1.5 rounded-full bg-card px-4 text-[13px] font-medium text-ink shadow-soft hover:bg-card"
							onClick={handleAddToPlanning}
							size="sm"
							variant="secondary"
						>
							<PlusIcon className="size-4" />
							Add
						</Button>
					</div>
				)}
			</div>
			<CardContent className="space-y-0.5 px-2.5 py-2.5">
				<h4 className="line-clamp-2 font-heading text-[14px] leading-tight font-normal text-ink">
					{props.media.name}
				</h4>
				{props.media.secondaryText && (
					<p className="line-clamp-1 text-xs text-muted-foreground">
						{props.media.secondaryText}
					</p>
				)}
				{props.media.releaseYear && (
					<p className="text-xs text-muted-foreground tabular-nums">
						{props.media.releaseYear}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
