import { api } from "@convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { LucideProps } from "lucide-react";
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
    <div className="flex flex-col bg-muted/30 rounded-lg space-y-2 border border-border/50">
      {/* Column Header */}
      <div className="p-3 border-b flex items-center justify-between text-sm border-b-border/30">
        <div className="flex items-center gap-2">
          <Icon className="size-4" />
          <span className="font-medium">{props.column.title}</span>
        </div>
        <Badge variant="secondary" className="text-xs">
          {props.logs.length}
        </Badge>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-2 overflow-y-auto">
        {props.logs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center opacity-50">
            <p className="text-xs text-muted-foreground">No items</p>
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
