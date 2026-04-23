import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import type { FunctionReturnType } from "convex/server";
import { TrashIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { filterStore } from "@/store/filter-store";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type Props = {
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	logs: FunctionReturnType<typeof api.logs.all>;
	selectedLogIds: Set<Id<"logs">>;
	setSelectedLogIds: React.Dispatch<React.SetStateAction<Set<Id<"logs">>>>;
	sectionStatus: string;
};

export default function ListViewToolbar({
	isEditing,
	setIsEditing,
	logs,
	selectedLogIds,
	setSelectedLogIds,
	sectionStatus,
}: Props) {
	const mediaType = useStore(filterStore, (state) => state.type);

	// clear selection
	const clearSelection = () => setSelectedLogIds(new Set());

	// mutation to bulk update status of multiple IDs
	const bulkUpdateStatusMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.bulkUpdateStatus),
		onSuccess: () => {
			clearSelection();
			setIsEditing(false);
			toast.success("Status updated");
		},
		onError: () => {
			toast.error("Something went wrong!", {
				description: "Please try again",
			});
		},
	});

	// mutation to bulk delete multiple IDs
	const bulkDeleteMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.bulkDelete),
		onSuccess: () => {
			clearSelection();
			toast.success("Items deleted");
		},
		onError: () => {
			toast.error("Something went wrong!", {
				description: "Please try again",
			});
		},
	});

	// select all items
	const selectAllVisible = () => {
		setSelectedLogIds((prev) => {
			const next = new Set(prev);
			for (const id of visibleIds) {
				next.add(id);
			}
			return next;
		});
		setIsEditing(true);
	};

	// call mutation here
	const bulkUpdate = (status: "planned" | "in_progress" | "completed") => {
		const ids = Array.from(selectedLogIds).filter((id) =>
			visibleIds.has(id),
		);
		if (ids.length === 0) {
			return;
		}
		toast.info("Updating status...");
		bulkUpdateStatusMutation.mutate({ logIds: ids, status });
	};

	// call delete mutation
	const bulkDelete = () => {
		const ids = Array.from(selectedLogIds).filter((id) =>
			visibleIds.has(id),
		);
		if (ids.length === 0) {
			return;
		}
		toast.info("Deleting items...");
		bulkDeleteMutation.mutate({ logIds: ids });
	};

	const visibleIds = useMemo(
		() => new Set(logs.map((log) => log._id)),
		[logs],
	);

	const numVisible = visibleIds.size;
	const numSelectedVisible = useMemo(
		() =>
			Array.from(selectedLogIds).filter((id) => visibleIds.has(id))
				.length,
		[selectedLogIds, visibleIds],
	);

	return (
		<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-start">
			{/* Row 1: selection info */}
			<div className="flex flex-wrap items-center gap-2">
				<div className="text-xs text-muted-foreground">
					{numSelectedVisible} selected
				</div>

				<Separator orientation="vertical" />

				<Button
					className="text-xs"
					disabled={
						numVisible === 0 || numSelectedVisible === numVisible
					}
					onClick={selectAllVisible}
					size="sm"
					variant="ghost"
				>
					Select all
				</Button>

				<Button
					className="text-xs"
					disabled={numSelectedVisible === 0}
					onClick={clearSelection}
					size="sm"
					variant="ghost"
				>
					Clear
				</Button>

				<Separator orientation="vertical" className="hidden sm:block" />
			</div>

			{/* Row 2: bulk actions */}
			<div className="flex flex-wrap items-center gap-2">
				{sectionStatus !== "planned" && (
					<Button
						className="text-xs"
						disabled={!isEditing || numSelectedVisible === 0}
						onClick={() => bulkUpdate("planned")}
						size="sm"
						variant="secondary"
					>
						Move to Planning
					</Button>
				)}

				{sectionStatus !== "in_progress" && (
					<Button
						className="text-xs"
						disabled={!isEditing || numSelectedVisible === 0}
						onClick={() => bulkUpdate("in_progress")}
						size="sm"
						variant="secondary"
					>
						{mediaType === "book"
							? "Move to Reading"
							: "Move to Watching"}
					</Button>
				)}

				{sectionStatus !== "completed" && (
					<Button
						className="text-xs"
						disabled={!isEditing || numSelectedVisible === 0}
						onClick={() => bulkUpdate("completed")}
						size="sm"
						variant="secondary"
					>
						Mark Completed
					</Button>
				)}

				<Button
					className="text-xs"
					disabled={!isEditing || numSelectedVisible === 0}
					onClick={bulkDelete}
					size="sm"
					variant="destructive"
				>
					<TrashIcon className="size-3" />
					Delete
				</Button>
			</div>
		</div>
	);
}
