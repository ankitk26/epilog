import { api } from "@convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { ClapperboardIcon } from "lucide-react";
import MediaCard from "./media-card";
import { Badge } from "./ui/badge";

type Props = {
  logs: FunctionReturnType<typeof api.mediaLogs.all>;
  section: {
    title: string;
    status: string;
    description: string;
  };
};

export default function GridViewSection(props: Props) {
  return (
    <div key={props.section.status} className="space-y-3">
      {/* Section title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">{props.section.title}</h2>
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {props.logs.length}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          {props.section.description}
        </p>
      </div>

      {/* Grid cards for media */}
      {props.logs.length !== 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {props.logs.map((log) => (
            <MediaCard
              key={log._id}
              media={{
                imageUrl: log.metadata.image,
                name: log.metadata.name || "NA",
                releaseYear: log.metadata.releaseYear,
                sourceId: log.metadata.sourceMediaId,
                type: log.metadata.type,
              }}
              displayOnly
            />
          ))}
        </div>
      )}

      {/* No data section */}
      {props.logs.length === 0 && (
        <div className="flex flex-col space-y-1.5 items-center justify-center py-8 text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <ClapperboardIcon className="size-4 text-muted-foreground" />
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
