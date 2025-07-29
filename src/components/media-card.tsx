import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { Clapperboard, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type Props = {
  media: {
    imageUrl: string | undefined | null;
    name: string;
    releaseYear: number | null;
    sourceId: number;
    type: "anime" | "tv" | "movie" | "book";
  };
  displayOnly?: boolean;
};

export default function MediaCard(props: Props) {
  const { displayOnly = false } = props;

  const addToPlanningMutation = useMutation({
    mutationFn: useConvexMutation(api.mediaLogs.addToPlanning),
    onSuccess: () => {
      toast.success("Added to planning");
    },
  });

  const handleAddToPlanning = () => {
    addToPlanningMutation.mutate({
      media: {
        name: props.media.name,
        releaseYear: props.media.releaseYear ?? 2025,
        sourceMediaId: props.media.sourceId,
        type: props.media.type,
        image: props.media.imageUrl ?? "",
      },
    });
  };

  return (
    <Card className="group overflow-hidden transition-shadow duration-200 hover:shadow-md p-0">
      <div className="aspect-[3/4] relative overflow-hidden">
        {props.media.imageUrl ? (
          <img
            src={props.media.imageUrl}
            alt={props.media.name}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Clapperboard className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {/* Add button overlay */}
        {!displayOnly && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm">
            <Button variant="secondary" size="sm" onClick={handleAddToPlanning}>
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-3 pt-0">
        <h4 className="font-medium text-xs line-clamp-2 mb-1">
          {props.media.name}
        </h4>
        {props.media.releaseYear && (
          <p className="text-xs text-muted-foreground">
            {props.media.releaseYear}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
