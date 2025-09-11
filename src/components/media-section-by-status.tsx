import type { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useStore } from "@tanstack/react-store";
import type { FunctionReturnType } from "convex/server";
import { BookIcon, ChevronDown, ClapperboardIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { filterStore } from "@/store/filter-store";
import ListCard from "./list-card";
import MediaCard from "./media-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
  logs: FunctionReturnType<typeof api.mediaLogs.all>;
  section: {
    title: string;
    status: string;
  };
  selectedIds?: Set<Id<"mediaLogs">>;
  onToggleSelect?: (id: Id<"mediaLogs">) => void;
  editMode?: boolean;
};

export default function MediaSectionByStatus(props: Props) {
  const view = useStore(filterStore, (state) => state.view);
  const mediaType = useStore(filterStore, (state) => state.type);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="space-y-3" key={props.section.status}>
      {/* Section title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Button
            className="size-7"
            onClick={() => setCollapsed((prevState) => !prevState)}
            size="icon"
            variant="ghost"
          >
            <ChevronDown
              className={cn(
                "size-3 transition-transform",
                collapsed ? "-rotate-90" : "rotate-0"
              )}
            />
          </Button>
          <h2 className="font-medium text-lg">{props.section.title}</h2>
          <Badge className="bg-muted text-muted-foreground" variant="secondary">
            {props.logs.length}
          </Badge>
        </div>
      </div>

      {/* Grid cards for media */}
      {!collapsed && props.logs.length !== 0 && (
        <div
          className={
            view === "list"
              ? "flex flex-col gap-3"
              : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          }
        >
          {props.logs.map((log) =>
            view === "list" ? (
              <ListCard
                key={log._id}
                log={log}
                onToggleSelect={props.onToggleSelect}
                selected={props.selectedIds?.has(log._id)}
                showCheckbox={props.editMode}
              />
            ) : (
              <MediaCard
                displayOnly
                key={log._id}
                media={{
                  imageUrl: log.metadata.image,
                  name: log.metadata.name || "NA",
                  releaseYear: log.metadata.releaseYear,
                  sourceId: log.metadata.sourceMediaId,
                  type: log.metadata.type,
                }}
              />
            )
          )}
        </div>
      )}

      {/* No data section */}
      {props.logs.length === 0 && (
        <div className="flex flex-col items-center justify-center space-y-1.5 rounded-lg border-2 border-muted-foreground/25 border-dashed py-8 text-center">
          {mediaType === "book" ? (
            <BookIcon className="size-4 text-muted-foreground" />
          ) : (
            <ClapperboardIcon className="size-4 text-muted-foreground" />
          )}
          <p className="text-muted-foreground text-xs">
            No items in this section
          </p>
          <p className="text-muted-foreground text-xs">
            Add some media to get started
          </p>
        </div>
      )}
    </div>
  );
}
