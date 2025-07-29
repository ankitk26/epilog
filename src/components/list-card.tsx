import { Card } from "@/components/ui/card";
import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
};

export default function ListCard({ log }: Props) {
  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {/* Poster */}
        <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0">
          {log.metadata?.image ? (
            <img
              src={log.metadata.image || "/placeholder.svg"}
              alt={log.metadata.name || "Media poster"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-sm">🎬</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-sm leading-tight">
                {log.metadata?.name || "Untitled"}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {log.metadata?.releaseYear && (
                  <span>{log.metadata.releaseYear}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
