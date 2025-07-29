import { useFilterStore } from "@/store/filter-store";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import MediaSectionByStatus from "./media-section-by-status";

export default function GridView() {
  const mediaType = useFilterStore((store) => store.type);

  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  const sections = [
    {
      title: "To Watch",
      status: "planned",
      description: "Items you're planning to watch",
    },
    {
      title: "Currently Watching",
      status: "in_progress",
      description: "Items you're currently watching",
    },
    {
      title: "Completed",
      status: "completed",
      description: "Items you've finished watching",
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
