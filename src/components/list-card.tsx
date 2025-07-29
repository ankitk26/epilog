import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Calendar, CheckCircle, Clock, MoreHorizontal } from "lucide-react";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
};

export default function ListCard({ log }: Props) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planned":
        return <Calendar className="h-3 w-3" />;
      case "in_progress":
        return <Clock className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "planned":
        return "To Watch";
      case "in_progress":
        return "Watching";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <Card className="p-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        {/* Poster */}
        <div className="w-12 h-16 rounded-md overflow-hidden flex-shrink-0">
          {log.metadata?.image ? (
            <img
              src={log.metadata.image || "/placeholder.svg"}
              alt={log.metadata.name || "Media poster"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-sm">🎬</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-medium text-sm leading-tight">
                {log.metadata?.name || "Untitled"}
              </h3>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {log.metadata?.releaseYear && (
                  <span>{log.metadata.releaseYear}</span>
                )}
                {log.metadata?.type && (
                  <span className="capitalize">{log.metadata.type}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-muted text-muted-foreground"
              >
                {getStatusIcon(log.status)}
                <span className="ml-1 text-xs">
                  {getStatusLabel(log.status)}
                </span>
              </Badge>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Move to Watching</DropdownMenuItem>
                  <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
