import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import KanbanCardActions from "./kanban-card-actions";
import KanbanCardInfo from "./kanban-card-info";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
};

export default function KanbanCard({ log }: Props) {
  return (
    <div className="group relative h-24 w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg">
      {/* Background Image */}
      <div className="h-full w-full">
        <img
          alt={log.metadata?.name || "Media"}
          className="h-full w-full object-cover"
          src={log.metadata?.image || "/placeholder.svg?height=80&width=200"}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-2">
        <div className="flex justify-end">
          <KanbanCardActions log={log} />
        </div>

        <KanbanCardInfo
          name={log.metadata?.name ?? ""}
          releaseYear={log.metadata?.releaseYear ?? 2025}
        />
      </div>
    </div>
  );
}
