import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { filterStore } from "@/store/filter-store";
import MediaSectionByStatus from "./media-section-by-status";

export default function ListViewByStatus() {
  const mediaType = useStore(filterStore, (state) => state.type);

  const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

  // logs filtered by media type
  const logsFilteredByMediaType = useMemo(
    () => logs.filter((log) => log.metadata.type === mediaType),
    [logs, mediaType]
  );

  const sections = [
    {
      title: mediaType === "book" ? "To Read" : "To Watch",
      status: "planned",
    },
    {
      title: mediaType === "book" ? "Reading" : "Watching",
      status: "in_progress",
    },
    {
      title: "Completed",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-12 pt-4 lg:space-y-16 lg:pt-0">
      {sections.map((section) => {
        return (
          <MediaSectionByStatus
            key={section.status}
            logs={logsFilteredByMediaType.filter(
              (log) => log.status === section.status
            )}
            section={section}
          />
        );
      })}
    </div>
  );
}
