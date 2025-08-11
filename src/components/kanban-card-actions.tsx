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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { filterStore } from "@/store/filter-store";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
};

export default function KanbanCardActions(props: Props) {
  const mediaType = useStore(filterStore, (state) => state.type);

  const updateStatusMutation = useMutation({
    mutationFn: useConvexMutation(api.mediaLogs.updateStatus),
    onSuccess: () => {
      toast.success("Status updated");
    },
  });

  const handleUpdateStatus = (
    status: "planned" | "in_progress" | "completed"
  ) => {
    updateStatusMutation.mutate({ mediaLogId: props.log._id, status });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="h-8 w-8 rounded-full bg-foreground/20 p-0 text-foreground opacity-100 transition-opacity group-hover:opacity-100 lg:opacity-0 lg:hover:bg-foreground/30"
          size="sm"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {props.log.status !== "planned" && (
          <DropdownMenuItem onClick={() => handleUpdateStatus("planned")}>
            Move to Planning
          </DropdownMenuItem>
        )}
        {props.log.status !== "in_progress" && (
          <DropdownMenuItem onClick={() => handleUpdateStatus("in_progress")}>
            Move to {mediaType === "book" ? "Reading" : "Watching"}
          </DropdownMenuItem>
        )}
        {props.log.status !== "completed" && (
          <DropdownMenuItem onClick={() => handleUpdateStatus("completed")}>
            Mark Completed
          </DropdownMenuItem>
        )}
        <KanbanCardDeleteAction mediaLogId={props.log._id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
