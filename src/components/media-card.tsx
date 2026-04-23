import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import type { MediaType } from "@/types";
import IconByType from "./icon-by-type";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type Props = {
	media: {
		imageUrl: string | undefined | null;
		name: string;
		releaseYear: number | null;
		sourceId: string;
		type: MediaType;
	};
	displayOnly?: boolean;
};

export default function MediaCard(props: Props) {
	const { displayOnly = false } = props;

	const addToPlanningMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.addToPlanning),
		onSuccess: (response: string) => {
			toast.success(response);
		},
	});

	const handleAddToPlanning = () => {
		toast.info("Adding...");
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
		<Card className="group w-full max-w-44 justify-self-center overflow-hidden p-0 transition-shadow duration-200 hover:shadow-md">
			<div className="relative aspect-[2/3] overflow-hidden">
				{props.media.imageUrl ? (
					<Image
						alt={props.media.name}
						className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
						height={176}
						src={props.media.imageUrl}
						width={264}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-muted">
						<IconByType
							className="size-6 text-muted-foreground"
							type={props.media.type}
						/>
					</div>
				)}
				{/* Add button overlay */}
				{!displayOnly && (
					<div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
						<Button
							onClick={handleAddToPlanning}
							size="sm"
							variant="secondary"
						>
							<PlusIcon className="h-3 w-3" />
							Add
						</Button>
					</div>
				)}
			</div>
			<CardContent className="space-y-0.5 p-2 pt-1">
				<h4 className="line-clamp-2 text-xs font-medium">
					{props.media.name}
				</h4>
				{props.media.releaseYear && (
					<p className="text-xs text-muted-foreground">
						{props.media.releaseYear}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
