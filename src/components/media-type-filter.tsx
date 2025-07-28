import { useFilterStore } from "@/store/filter-store";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";

export default function MediaTypeFilter() {
  const type = useFilterStore((store) => store.type);
  const setType = useFilterStore((store) => store.setType);
  const { data: logs } = useSuspenseQuery(convexQuery(api.mediaLogs.all, {}));

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Media Types
      </h3>
      <div className="space-y-1">
        {[
          {
            value: "anime",
            label: "Anime",
            color: "bg-foreground",
            count: logs.filter((log) => log.metadata?.type === "anime").length,
          },
          {
            value: "movie",
            label: "Movies",
            color: "bg-muted-foreground",
            count: logs.filter((log) => log.metadata?.type === "movie").length,
          },
          {
            value: "tv",
            label: "TV Shows",
            color: "bg-muted-foreground/70",
            count: logs.filter((log) => log.metadata?.type === "tv").length,
          },
          {
            value: "book",
            label: "Books",
            color: "bg-muted-foreground/50",
            count: logs.filter((log) => log.metadata?.type === "book").length,
          },
        ].map((item) => {
          const isActive = type === item.value;

          return (
            <Button
              key={item.label}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-between h-8 px-2 text-xs ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => setType(item.value as any)}
            >
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                <span>{item.label}</span>
              </div>
              <span
                className={
                  isActive
                    ? "text-accent-foreground/70"
                    : "text-muted-foreground"
                }
              >
                {item.count}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
