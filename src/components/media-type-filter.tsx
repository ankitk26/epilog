import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { cn } from "@/lib/utils";
import { filterStore } from "@/store/filter-store";
import { useSidebarStore } from "@/store/sidebar-store";
import type { MediaType } from "@/types";
import { Button } from "./ui/button";

export default function MediaTypeFilter() {
  const type = useStore(filterStore, (state) => state.type);
  const toggleSidebar = useSidebarStore((store) => store.toggle);

  const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

  const logCountsByType = [
    {
      type: "anime",
      label: "Anime",
      color: "bg-foreground",
      count: logs.filter((log) => log.metadata.type === "anime").length,
    },
    {
      type: "movie",
      label: "Movies",
      color: "bg-muted-foreground",
      count: logs.filter((log) => log.metadata.type === "movie").length,
    },
    {
      type: "tv",
      label: "TV Shows",
      color: "bg-muted-foreground/70",
      count: logs.filter((log) => log.metadata.type === "tv").length,
    },
    {
      type: "book",
      label: "Books",
      color: "bg-muted-foreground/50",
      count: logs.filter((log) => log.metadata.type === "book").length,
    },
  ];

  return (
    <div className="space-y-1">
      {logCountsByType.map((logTypeItem) => {
        const isActive = type === logTypeItem.type;

        return (
          <Button
            className={cn(
              "h-8 w-full justify-between px-2 text-xs",
              isActive
                ? "border bg-accent text-accent-foreground dark:border-accent"
                : "hover:bg-foreground/5"
            )}
            key={logTypeItem.label}
            onClick={() => {
              // Only toggle sidebar on mobile/tablet (lg and below)
              if (window.innerWidth < 1024) {
                toggleSidebar();
              }

              filterStore.setState((state) => ({
                ...state,
                type: logTypeItem.type as MediaType,
              }));
            }}
            variant={isActive ? "secondary" : "ghost"}
          >
            <div className="flex items-center gap-2">
              <div className={`size-1.5 rounded-full ${logTypeItem.color}`} />
              <span>{logTypeItem.label}</span>
            </div>

            <span
              className={
                isActive ? "text-accent-foreground/70" : "text-muted-foreground"
              }
            >
              {logTypeItem.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
