import { Badge } from "@/components/ui/badge";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import ListCard from "./list-card";

export default function ListView() {
  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium tracking-tight">Media Library</h1>
          <p className="text-muted-foreground text-xs">
            Manage your anime, movies, and TV shows
          </p>
        </div>
        <Badge variant="secondary">{mediaLogs.length} items</Badge>
      </div>

      <div className="space-y-2">
        {mediaLogs.length > 0 ? (
          mediaLogs.map((log) => <ListCard key={log._id} log={log} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="text-4xl mb-2">📺</div>
            <h3 className="text-base font-medium mb-1">No media found</h3>
            <p className="text-muted-foreground text-xs">
              Add some anime, movies, or TV shows to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
