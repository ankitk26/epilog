import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import { filterStore } from "@/store/filter-store";
import MediaSectionByStatus from "./media-section-by-status";

export default function ListView() {
  const mediaType = useStore(filterStore, (state) => state.type);

  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  // logs filtered by media type - anime/movie/tv/book
  const logsFilteredByMediaType = useMemo(
    () => mediaLogs.filter((log) => log.metadata.type === mediaType),
    [mediaLogs, mediaType]
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
    <div className="space-y-12 pt-4 lg:space-y-30 lg:pt-0">
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
