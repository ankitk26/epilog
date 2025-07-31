import { KanbanIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { useFilterStore } from "@/store/filter-store";
import type { FilterMediaView } from "@/types";
import { Button } from "./ui/button";

export default function CardsViewFilter() {
  const view = useFilterStore((store) => store.view);
  const setView = useFilterStore((store) => store.setView);

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
        View Mode
      </h3>
      <div className="space-y-1">
        {[
          { value: "list", label: "List View", icon: ListIcon },
          { value: "kanban", label: "Kanban Board", icon: KanbanIcon },
          { value: "grid", label: "Grid Layout", icon: LayoutGridIcon },
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
              onClick={() => setView(option.value as FilterMediaView)}
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
