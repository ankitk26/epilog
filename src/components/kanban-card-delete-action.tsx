import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
