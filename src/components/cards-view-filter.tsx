import { useStore } from "@tanstack/react-store";
import { KanbanIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { filterStore } from "@/store/filter-store";
import { useSidebarStore } from "@/store/sidebar-store";
import type { FilterMediaView } from "@/types";
import { Button } from "./ui/button";

export default function CardsViewFilter() {
  const view = useStore(filterStore, (state) => state.view);
  const toggleSidebar = useSidebarStore((store) => store.toggle);

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
        View Mode
      </h3>
      <div className="space-y-1">
        {[
          { value: "list", label: "List View", icon: ListIcon },
          { value: "grid", label: "Grid Layout", icon: LayoutGridIcon },
          { value: "kanban", label: "Kanban Board", icon: KanbanIcon },
        ].map((option) => {
          const Icon = option.icon;
          const isActive = view === option.value;

          return (
            <Button
              className={`h-8 w-full justify-start px-2 text-xs ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
              key={option.value}
              onClick={() => {
                // Only toggle sidebar on mobile/tablet (lg and below)
                if (window.innerWidth < 1024) {
                  toggleSidebar();
                }
                filterStore.setState((state) => ({
                  ...state,
                  view: option.value as FilterMediaView,
                }));
              }}
              variant={isActive ? "secondary" : "ghost"}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3 w-3" />
                <span>{option.label}</span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
