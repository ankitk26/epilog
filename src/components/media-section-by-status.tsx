import type { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useStore } from "@tanstack/react-store";
import type { FunctionReturnType } from "convex/server";
import {
  BookIcon,
  ChevronDown,
  ClapperboardIcon,
  PencilIcon,
  PencilOffIcon,
  Tv2Icon,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { filterStore } from "@/store/filter-store";
import EmptyStateMessage from "./empty-state-message";
import ListCard from "./list-card";
import ListViewToolbar from "./list-view-toolbar";
import MediaCard from "./media-card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

type Props = {
  logs: FunctionReturnType<typeof api.logs.all>;
  section: {
    title: string;
    status: string;
  };
};

export default function MediaSectionByStatus(props: Props) {
  const view = useStore(filterStore, (state) => state.view);
  const mediaType = useStore(filterStore, (state) => state.type);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLogIds, setSelectedLogIds] = useState<Set<Id<"logs">>>(
    new Set()
  );

  // toggle selection of a single item
  const onToggleSelect = (id: Id<"logs">) => {
    setSelectedLogIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {/* Section title */}
      <div className="flex items-center justify-between space-y-1">
        <div className="flex items-center gap-3">
          {/* Collapse button */}
          {props.logs.length > 0 && (
            <Button
              className="size-6"
              onClick={() => setIsCollapsed((prevState) => !prevState)}
              size="icon"
              variant="outline"
            >
              <ChevronDown
                className={cn(
                  "size-3 transition-transform",
                  isCollapsed ? "-rotate-90" : "rotate-0"
                )}
              />
            </Button>
          )}

          <h2 className="font-medium text-lg">{props.section.title}</h2>
          <Badge className="bg-muted text-muted-foreground" variant="secondary">
            {props.logs.length}
          </Badge>
        </div>

        {/* Section toolbar */}
        {props.logs.length > 0 && view === "list" && (
          <Button
            className="size-7"
            onClick={() => setIsEditing((prev) => !prev)}
            size="icon"
            variant="outline"
          >
            {isEditing ? (
              <PencilOffIcon className="size-3" />
            ) : (
              <PencilIcon className="size-3" />
            )}
          </Button>
        )}
      </div>

      <div className="flex justify-end">
        {isEditing && props.logs.length > 0 && view === "list" && (
          <ListViewToolbar
            isEditing={isEditing}
            logs={props.logs}
            sectionStatus={props.section.status}
            selectedLogIds={selectedLogIds}
            setIsEditing={setIsEditing}
            setSelectedLogIds={setSelectedLogIds}
          />
        )}
      </div>

      {!isCollapsed && props.logs.length !== 0 && (
        <div
          className={
            view === "list"
              ? "flex flex-col gap-4"
              : "grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
          }
        >
          {props.logs.map((log) =>
            view === "list" ? (
              <ListCard
                key={log._id}
                log={log}
                onToggleSelect={onToggleSelect}
                selected={selectedLogIds.has(log._id)}
                showCheckbox={isEditing}
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
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border-2 border-muted-foreground/25 border-dashed py-8 text-center">
          {mediaType === "book" && (
            <BookIcon className="size-8 text-muted-foreground" />
          )}
          {mediaType === "movie" && (
            <ClapperboardIcon className="size-8 text-muted-foreground" />
          )}
          {mediaType === "tv" && (
            <Tv2Icon className="size-8 text-muted-foreground" />
          )}
          <p className="text-muted-foreground text-xs">
            <EmptyStateMessage />
          </p>
        </div>
      )}
    </div>
  );
}
