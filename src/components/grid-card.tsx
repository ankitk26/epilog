import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, Calendar } from "lucide-react";

type Props = {
  log: FunctionReturnType<typeof api.mediaLogs.all>[0];
};

export default function GridCard({ log }: Props) {
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

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
      <div className="aspect-[3/4] relative overflow-hidden">
        {log.metadata?.image ? (
          <img
            src={log.metadata.image || "/placeholder.svg"}
            alt={log.metadata.name || "Media poster"}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <div className="text-2xl">🎬</div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant="secondary"
            className="bg-background/80 text-foreground text-xs"
          >
            {getStatusIcon(log.status)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-2">
        <h4 className="font-medium text-xs line-clamp-2 mb-1">
          {log.metadata?.name || "Untitled"}
        </h4>
        {log.metadata?.releaseDate && (
          <p className="text-xs text-muted-foreground">
            {new Date(log.metadata.releaseDate).getFullYear()}
          </p>
        )}
        <p className="text-xs text-muted-foreground capitalize">
          {log.metadata?.type}
        </p>
      </CardContent>
    </Card>
  );
}
