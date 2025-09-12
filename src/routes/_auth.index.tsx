import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { Suspense } from "react";
import KanbanView from "@/components/kanban-view";
import ListViewByStatus from "@/components/list-view-by-status";
import { filterStore } from "@/store/filter-store";

export const Route = createFileRoute("/_auth/")({
  component: Home,
});

function Home() {
  const view = useStore(filterStore, (state) => state.view);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {view === "kanban" ? <KanbanView /> : <ListViewByStatus />}
    </Suspense>
  );
}
