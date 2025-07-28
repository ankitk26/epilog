import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, CheckCircle, Clock, Plus } from "lucide-react";
import KanbanCard from "./kanban-card";

export default function KanbanView() {
  const { data: mediaLogs } = useSuspenseQuery(
    convexQuery(api.mediaLogs.all, {})
  );

  const columns = [
    {
      id: "planned",
      title: "To Watch",
      icon: Calendar,
      items: mediaLogs.filter((log) => log.status === "planned"),
    },
    {
      id: "in_progress",
      title: "Watching",
      icon: Clock,
      items: mediaLogs.filter((log) => log.status === "in_progress"),
    },
    {
      id: "completed",
      title: "Completed",
      icon: CheckCircle,
      items: mediaLogs.filter((log) => log.status === "completed"),
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-xl font-medium tracking-tight mb-1">
          Kanban Board
        </h1>
        <p className="text-muted-foreground text-xs">
          Organize your media by status
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-130px)]">
        {columns.map((column) => {
          const Icon = column.icon;

          return (
            <Card key={column.id} className="flex flex-col bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {column.title}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {column.items.length}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 space-y-2 overflow-y-auto">
                {column.items.length > 0 ? (
                  column.items.map((log) => (
                    <KanbanCard key={log._id} log={log} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center opacity-50">
                    <div className="text-xl mb-1">📺</div>
                    <p className="text-xs text-muted-foreground">No items</p>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="w-full border-2 border-dashed border-muted-foreground/25 h-10 hover:border-muted-foreground/50"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="text-xs">Add Item</span>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
