import type { api } from "@convex/_generated/api";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import IconByType from "./icon-by-type";
import KanbanCardActions from "./kanban-card-actions";

type Props = {
  log: FunctionReturnType<typeof api.logs.all>[0];
};

export default function KanbanCard({ log }: Props) {
  return (
    <div className="group relative h-24 w-full overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg">
      {/* Background Image */}
      <div className="h-full w-full">
        {log.metadata?.image ? (
          <Image
            alt={log.metadata?.name || "Media"}
            className="h-full w-full object-cover"
            height={96}
            src={log.metadata.image}
            width={150}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <IconByType
              className="size-8 text-muted-foreground"
              type={log.metadata?.type}
            />
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-2">
        <div className="flex justify-end">
          <KanbanCardActions log={log} />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="mb-1 line-clamp-2 font-semibold text-sm text-white leading-tight drop-shadow-lg">
            {log.metadata.name}
          </h4>
          <p className="text-white/90 text-xs drop-shadow-md">
            {log.metadata.releaseYear}
          </p>
        </div>
      </div>
    </div>
  );
}
