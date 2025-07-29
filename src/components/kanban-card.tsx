import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import KanbanCardActions from "./kanban-card-actions";
import KanbanCardInfo from "./kanban-card-info";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
};

export default function KanbanCard({ log }: Props) {
  return (
    <div className="group cursor-pointer hover:shadow-lg transition-all duration-300 w-full h-24 rounded-lg overflow-hidden relative">
      {/* Background Image */}
      <img
        src={log.metadata?.image || "/placeholder.svg?height=80&width=200"}
        alt={log.metadata?.name || "Media"}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="absolute inset-0 p-2 flex flex-col justify-between">
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
