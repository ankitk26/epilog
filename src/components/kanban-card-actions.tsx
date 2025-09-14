import { api } from "@convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import type { FunctionReturnType } from "convex/server";
import { MoreHorizontal } from "lucide-react";
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
import { filterStore } from "@/store/filter-store";

type Props = {
  log: FunctionReturnType<typeof api.logs.all>[0];
};

export default function KanbanCardActions(props: Props) {
  const mediaType = useStore(filterStore, (state) => state.type);

  const updateStatusMutation = useMutation({
    mutationFn: useConvexMutation(api.logs.updateStatus),
    onSuccess: () => {
      toast.success("Status updated");
    },
  });

  const handleUpdateStatus = (
    status: "planned" | "in_progress" | "completed"
  ) => {
    toast.info("Updating status...");
    updateStatusMutation.mutate({ logId: props.log._id, status });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="size-8 rounded-full bg-background/50 p-0 text-foreground opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0"
          size="sm"
          variant="ghost"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
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
