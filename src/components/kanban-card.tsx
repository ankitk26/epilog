import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { MoreHorizontal } from "lucide-react";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
};

export default function KanbanCard({ log }: Props) {
  return (
    <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
      <CardContent className="p-2">
        <div className="flex gap-2">
          {/* Thumbnail */}
          <div className="w-10 h-12 rounded-md overflow-hidden flex-shrink-0">
            {log.metadata?.image ? (
              <img
                src={log.metadata.image || "/placeholder.svg"}
                alt={log.metadata.name || "Media poster"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-xs">🎬</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h4 className="font-medium text-xs line-clamp-2 leading-tight">
                {log.metadata?.name || "Untitled"}
              </h4>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Move to Planned</DropdownMenuItem>
                  <DropdownMenuItem>Move to Watching</DropdownMenuItem>
                  <DropdownMenuItem>Mark Completed</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-1">
              {log.metadata?.releaseDate && (
                <p className="text-xs text-muted-foreground">
                  {new Date(log.metadata.releaseDate).getFullYear()}
                </p>
              )}

              {log.metadata?.type && (
                <Badge
                  variant="outline"
                  className="text-xs h-4 px-1 capitalize"
                >
                  {log.metadata.type}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
