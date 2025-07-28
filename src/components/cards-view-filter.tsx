import { useFilterStore } from "@/store/filter-store";
import { KanbanIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { Button } from "./ui/button";

export default function CardsViewFilter() {
  const view = useFilterStore((store) => store.view);
  const setView = useFilterStore((store) => store.setView);

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
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
              key={option.value}
              variant={isActive ? "secondary" : "ghost"}
              className={`w-full justify-start h-8 px-2 text-xs ${
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => setView(option.value as any)}
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
