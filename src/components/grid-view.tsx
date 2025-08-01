import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import MediaSectionByStatus from "@/components/media-section-by-status";
import { useFilterStore } from "@/store/filter-store";

export default function GridView() {
  const mediaType = useFilterStore((store) => store.type);

  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  const sections = [
    {
      title: mediaType === "book" ? "To read" : "To watch",
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

  const logsFilteredByMediaType = mediaLogs.filter(
    (log) => log.metadata.type === mediaType
  );

  return (
    <div className="space-y-16 p-4">
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
