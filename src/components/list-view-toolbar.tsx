import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import type { FunctionReturnType } from "convex/server";
import { PencilIcon, XIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { filterStore } from "@/store/filter-store";
import { Button } from "./ui/button";

type Props = {
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  logs: FunctionReturnType<typeof api.mediaLogs.all>;
  selectedIds: Set<Id<"mediaLogs">>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<Id<"mediaLogs">>>>;
  sectionStatus: string;
};

export default function ListViewToolbar({
  editMode,
  setEditMode,
  logs,
  selectedIds,
  setSelectedIds,
  sectionStatus,
}: Props) {
  const mediaType = useStore(filterStore, (state) => state.type);

  // mutation to bulk update status of multiple IDs
  const bulkUpdateStatusMutation = useMutation({
    mutationFn: useConvexMutation(api.mediaLogs.bulkUpdateStatus),
    onSuccess: () => {
      clearSelection();
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Something went wrong!", { description: "Please try again" });
    },
  });

  const visibleIds = useMemo(
    () => new Set(logs.map((log) => log._id as Id<"mediaLogs">)),
    [logs]
  );

  const numVisible = visibleIds.size;
  const numSelectedVisible = useMemo(
    () => Array.from(selectedIds).filter((id) => visibleIds.has(id)).length,
    [selectedIds, visibleIds]
  );

  // select all items
  const selectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of visibleIds) {
        next.add(id);
      }
      return next;
    });
    setEditMode(true);
  };

  // clear selection
  const clearSelection = () => setSelectedIds(new Set());

  // call mutation here
  const bulkUpdate = (status: "planned" | "in_progress" | "completed") => {
    const ids = Array.from(selectedIds).filter((id) => visibleIds.has(id));
    if (ids.length === 0) {
      return;
    }
    toast.info("Updating status...");
    bulkUpdateStatusMutation.mutate({ mediaLogIds: ids, status });
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      {/* Selection counter */}
      <div className="text-muted-foreground text-xs">
        {numSelectedVisible > 0
          ? `${numSelectedVisible} selected`
          : `${numVisible} items`}
      </div>

      {/* Edit toggle button */}
      <Button
        aria-pressed={editMode}
        className="gap-1 text-xs"
        onClick={() => {
          setEditMode((prev) => {
            const next = !prev;
            if (!next) {
              clearSelection();
            }
            return next;
          });
        }}
        size="sm"
        variant={editMode ? "secondary" : "ghost"}
      >
        {editMode ? (
          <XIcon className="h-3 w-3" />
        ) : (
          <PencilIcon className="h-3 w-3" />
        )}
        {editMode ? "Done" : "Edit"}
      </Button>

      <div className="h-4 w-px bg-border" />

      {/* Select all button */}
      <Button
        className="text-xs"
        disabled={numVisible === 0 || numSelectedVisible === numVisible}
        onClick={selectAllVisible}
        size="sm"
        variant="ghost"
      >
        Select all
      </Button>

      {/* Clear all button */}
      <Button
        className="text-xs"
        disabled={numSelectedVisible === 0}
        onClick={clearSelection}
        size="sm"
        variant="ghost"
      >
        Clear
      </Button>

      <div className="h-4 w-px bg-border" />

      {/* Move to planning button - hide if current section is planning */}
      {sectionStatus !== "planned" && (
        <Button
          className="text-xs"
          disabled={!editMode || numSelectedVisible === 0}
          onClick={() => bulkUpdate("planned")}
          size="sm"
          variant="secondary"
        >
          Move to Planning
        </Button>
      )}

      {/* Move to progress button - hide if current section is in_progress */}
      {sectionStatus !== "in_progress" && (
        <Button
          className="text-xs"
          disabled={!editMode || numSelectedVisible === 0}
          onClick={() => bulkUpdate("in_progress")}
          size="sm"
          variant="secondary"
        >
          {mediaType === "book" ? "Move to Reading" : "Move to Watching"}
        </Button>
      )}

      {/* Move to completed button - hide if current section is completed */}
      {sectionStatus !== "completed" && (
        <Button
          className="text-xs"
          disabled={!editMode || numSelectedVisible === 0}
          onClick={() => bulkUpdate("completed")}
          size="sm"
          variant="secondary"
        >
          Mark Completed
        </Button>
      )}
    </div>
  );
}
