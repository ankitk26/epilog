import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { Id } from "@convex/_generated/dataModel";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DropdownMenuItem } from "./ui/dropdown-menu";

type Props = {
  mediaLogId: Id<"mediaLogs">;
};

export default function KanbanCardDeleteAction(props: Props) {
  const removeLogMutation = useMutation({
    mutationFn: useConvexMutation(api.mediaLogs.remove),
    onSuccess: () => {
      toast.success("Removed log");
    },
  });

  return (
    <DropdownMenuItem
      className="text-destructive text-xs"
      onClick={() => removeLogMutation.mutate({ mediaLogId: props.mediaLogId })}
    >
      Delete
    </DropdownMenuItem>
  );
}
