import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import GridViewSection from "./grid-view-section";

export default function GridView() {
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

  return (
    <div className="space-y-16 p-4">
      {sections.map((section) => {
        return (
          <GridViewSection
            key={section.status}
            logs={mediaLogs.filter((log) => log.status === section.status)}
            section={section}
          />
        );
      })}
    </div>
  );
}
