import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { LucideProps } from "lucide-react";
import KanbanCard from "./kanban-card";
import { Badge } from "./ui/badge";

type Props = {
  column: {
    status: string;
    title: string;
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  };
  logs: FunctionReturnType<typeof api.mediaLogs.all>;
};

export default function KanbanColumn(props: Props) {
  const Icon = props.column.icon;

  return (
    <div className="flex flex-col space-y-2 rounded-lg border border-border/50 bg-muted/30">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-b-border/30 p-3 text-sm">
        <div className="flex items-center gap-2">
          <Icon className="size-4" />
          <span className="font-medium">{props.column.title}</span>
        </div>
        <Badge className="text-xs" variant="secondary">
          {props.logs.length}
        </Badge>
      </div>

      {/* Column Content */}
      <div className="min-w-0 flex-1 overflow-y-auto p-2">
        {props.logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
            <p className="text-muted-foreground text-xs">No items</p>
          </div>
        )}

        <div className="space-y-3">
          {props.logs.length > 0 &&
            props.logs.map((log) => <KanbanCard key={log._id} log={log} />)}
        </div>
      </div>
    </div>
  );
}
