/** biome-ignore-all lint/a11y/noStaticElementInteractions: ignore here */
/** biome-ignore-all lint/nursery/noNoninteractiveElementInteractions: ignore here */
/** biome-ignore-all lint/a11y/useAriaPropsSupportedByRole: ignore here */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: ignore here */

import type { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { Card } from "@/components/ui/card";
import { Checkbox } from "./ui/checkbox";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
  selected?: boolean;
  onToggleSelect?: (id: Id<"mediaLogs">) => void;
  showCheckbox?: boolean;
};

export default function ListCard({
  log,
  selected,
  onToggleSelect,
  showCheckbox,
}: Props) {
  return (
    <Card
      className={
        "p-3 transition-shadow hover:shadow-md " +
        (selected ? "ring-2 ring-ring/60" : "")
      }
    >
      <div
        aria-pressed={showCheckbox ? !!selected : undefined}
        className="flex items-center gap-3"
        onClick={showCheckbox ? () => onToggleSelect?.(log._id) : undefined}
        role={showCheckbox ? "button" : undefined}
      >
        {/* Selector */}
        {showCheckbox && (
          <Checkbox
            checked={!!selected}
            onChange={() => onToggleSelect?.(log._id)}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {/* Poster */}
        <div className="h-30 w-20 flex-shrink-0 overflow-hidden rounded-md">
          {log.metadata?.image ? (
            <Image
              alt={log.metadata.name || "Media poster"}
              className="h-full w-full object-cover"
              height={120}
              src={log.metadata.image || "/placeholder.svg"}
              width={80}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-sm">🎬</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-sm leading-tight">
                {log.metadata?.name || "Untitled"}
              </h3>
              <div className="flex items-center gap-3 text-muted-foreground text-xs">
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
