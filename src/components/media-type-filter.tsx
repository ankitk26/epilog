import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { filterStore } from "@/store/filter-store";
import { useSidebarStore } from "@/store/sidebar-store";
import type { MediaType } from "@/types";
import { Button } from "./ui/button";

export default function MediaTypeFilter() {
  const type = useStore(filterStore, (state) => state.type);
  const toggleSidebar = useSidebarStore((store) => store.toggle);
  const { data: logs } = useSuspenseQuery(convexQuery(api.mediaLogs.all, {}));

  return (
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
            className={`h-8 w-full justify-between px-2 text-xs ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent/50"
            }`}
            key={item.label}
            onClick={() => {
              toggleSidebar();
              filterStore.setState((state) => ({
                ...state,
                type: item.value as MediaType,
              }));
            }}
            variant={isActive ? "secondary" : "ghost"}
          >
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
              <span>{item.label}</span>
            </div>
            <span
              className={
                isActive ? "text-accent-foreground/70" : "text-muted-foreground"
              }
            >
              {item.count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
