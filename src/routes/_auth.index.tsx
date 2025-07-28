import GridView from "@/components/grid-view";
import KanbanView from "@/components/kanban-view";
import ListView from "@/components/list-view";
import { useFilterStore } from "@/store/filter-store";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_auth/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.mediaLogs.all, {})
    );
  },
  component: Home,
});

function Home() {
  const view = useFilterStore((store) => store.view);

  return (
    <div className="col-span-3 w-full py-4 px-8">
      <Suspense fallback={<p>Loading...</p>}>
        {view === "grid" && <GridView />}
        {view === "kanban" && <KanbanView />}
        {view === "list" && <ListView />}
      </Suspense>
    </div>
  );
}
