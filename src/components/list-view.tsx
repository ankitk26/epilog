import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useMemo, useState } from "react";
import { filterStore } from "@/store/filter-store";
import ListViewToolbar from "./list-view-toolbar";
import MediaSectionByStatus from "./media-section-by-status";

export default function ListView() {
  const mediaType = useStore(filterStore, (state) => state.type);

  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  // keep track of selected items
  const [selectedIds, setSelectedIds] = useState<Set<Id<"mediaLogs">>>(
    new Set()
  );

  // handle state to toggle edit mode
  const [editMode, setEditMode] = useState(false);

  // logs filtered by media type - anime/movie/tv/book
  const logsFilteredByMediaType = useMemo(
    () => mediaLogs.filter((log) => log.metadata.type === mediaType),
    [mediaLogs, mediaType]
  );

  // toggle single item selection
  const toggleOne = (id: Id<"mediaLogs">) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sections = [
    {
      title: mediaType === "book" ? "To Read" : "To Watch",
      status: "planned",
    },
    {
      title: mediaType === "book" ? "Reading" : "Watching",
      status: "in_progress",
    },
    {
      title: "Completed",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-12 pt-4 lg:space-y-30 lg:pt-0">
      <ListViewToolbar
        editMode={editMode}
        logsFilteredByMediaType={logsFilteredByMediaType}
        selectedIds={selectedIds}
        setEditMode={setEditMode}
        setSelectedIds={setSelectedIds}
      />

      {sections.map((section) => {
        return (
          <MediaSectionByStatus
            editMode={editMode}
            key={section.status}
            logs={logsFilteredByMediaType.filter(
              (log) => log.status === section.status
            )}
            onToggleSelect={toggleOne}
            section={section}
            selectedIds={selectedIds}
          />
        );
      })}
    </div>
  );
}
