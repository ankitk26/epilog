import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CalendarIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import { useFilterStore } from "@/store/filter-store";
import KanbanColumn from "./kanban-column";

export default function KanbanView() {
  const mediaType = useFilterStore((store) => store.type);

  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  const columns = [
    {
      status: "planned",
      title: "To Watch",
      icon: CalendarIcon,
    },
    {
      status: "in_progress",
      title: "Watching",
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
