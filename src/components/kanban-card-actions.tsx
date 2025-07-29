import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import KanbanCardDeleteAction from "./kanban-card-delete-action";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
};

export default function KanbanCardActions(props: Props) {
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
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground/20 hover:bg-foreground/30 text-foreground rounded-full"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          className="text-xs"
          onClick={() => handleUpdateStatus("planned")}
        >
          Move to Planned
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-xs"
          onClick={() => handleUpdateStatus("in_progress")}
        >
          Move to Watching
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-xs"
          onClick={() => handleUpdateStatus("completed")}
        >
          Mark Completed
        </DropdownMenuItem>
        <KanbanCardDeleteAction mediaLogId={props.log._id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
