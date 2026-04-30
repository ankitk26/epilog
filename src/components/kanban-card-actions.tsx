import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import { toast } from "sonner";
import KanbanCardDeleteAction from "@/components/kanban-card-delete-action";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaFilters } from "@/hooks/use-media-filters";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
};

export default function KanbanCardActions(props: Props) {
	const { type: mediaType } = useMediaFilters();

	const updateStatusMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.updateStatus),
		onSuccess: () => {
			toast.success("Status updated");
		},
	});

	const handleUpdateStatus = (
		status: "planned" | "in_progress" | "completed",
	) => {
		toast.info("Updating status...");
		updateStatusMutation.mutate({ logId: props.log._id, status });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						className="size-8 rounded-full bg-background/50 p-0 text-foreground opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0"
						size="sm"
						variant="ghost"
					>
						<DotsThreeIcon className="size-4" />
					</Button>
				}
			/>

			<DropdownMenuContent align="end" className="w-40">
				{props.log.status !== "planned" && (
					<DropdownMenuItem
						className="text-xs"
						onClick={() => handleUpdateStatus("planned")}
					>
						Move to Planning
					</DropdownMenuItem>
				)}
				{props.log.status !== "in_progress" && (
					<DropdownMenuItem
						className="text-xs"
						onClick={() => handleUpdateStatus("in_progress")}
					>
						Move to {mediaType === "book" ? "Reading" : "Watching"}
					</DropdownMenuItem>
				)}
				{props.log.status !== "completed" && (
					<DropdownMenuItem
						className="text-xs"
						onClick={() => handleUpdateStatus("completed")}
					>
						Mark Completed
					</DropdownMenuItem>
				)}
				<DropdownMenuSeparator />
				<KanbanCardDeleteAction logId={props.log._id} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
