import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Suspense } from "react";
import GridView from "@/components/grid-view";
import KanbanView from "@/components/kanban-view";
import ListView from "@/components/list-view";
import { filterStore } from "@/store/filter-store";

export const Route = createFileRoute("/_auth/")({
  component: Home,
});

function Home() {
  const view = useStore(filterStore, (state) => state.view);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {view === "grid" && <GridView />}
      {view === "kanban" && <KanbanView />}
      {view === "list" && <ListView />}
    </Suspense>
  );
}
