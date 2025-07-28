import { Badge } from "@/components/ui/badge";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import GridCard from "./grid-card";

export default function GridView() {
  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  const sections = [
    {
      title: "To Watch",
      status: "planned",
      description: "Items you're planning to watch",
      color: "bg-muted text-muted-foreground",
    },
    {
      title: "Currently Watching",
      status: "in_progress",
      description: "Items you're currently watching",
      color: "bg-muted text-muted-foreground",
    },
    {
      title: "Completed",
      status: "completed",
      description: "Items you've finished watching",
      color: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-6 p-4">
      {sections.map((section) => {
        const filteredLogs = mediaLogs.filter(
          (log) => log.status === section.status
        );

        return (
          <div key={section.status} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-medium tracking-tight">
                    {section.title}
                  </h2>
                  <Badge variant="secondary" className={section.color}>
                    {filteredLogs.length}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>

            {filteredLogs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredLogs.map((log) => (
                  <GridCard key={log._id} log={log} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <div className="text-2xl mb-1">📺</div>
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
      })}
    </div>
  );
}
