import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { CalendarIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { filterStore } from "@/store/filter-store";
import KanbanColumn from "./kanban-column";

export default function KanbanView() {
  const mediaType = useStore(filterStore, (state) => state.type);

  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  const columns = [
    {
      status: "planned",
      title: mediaType === "book" ? "To read" : "To watch",
      icon: CalendarIcon,
    },
    {
      status: "in_progress",
      title: mediaType === "book" ? "Reading" : "Watching",
      icon: ClockIcon,
    },
    {
      status: "completed",
      title: "Completed",
      icon: CheckCircleIcon,
    },
  ];

  const logsFilteredByMediaType = mediaLogs.filter(
    (log) => log.metadata.type === mediaType
  );

  return (
    <div className="grid h-[calc(100vh-50px)] grid-cols-3 gap-4">
      {columns.map((column) => (
        <KanbanColumn
          column={column}
          key={column.status}
          logs={logsFilteredByMediaType.filter(
            (log) => log.status === column.status
          )}
        />
      ))}
    </div>
  );
}
