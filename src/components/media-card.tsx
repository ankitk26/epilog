import { api } from "@convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { BookIcon, Clapperboard, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type Props = {
  media: {
    imageUrl: string | undefined | null;
    name: string;
    releaseYear: number | null;
    sourceId: string;
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
    <Card className="group overflow-hidden p-0 transition-shadow duration-200 hover:shadow-md">
      <div className="relative aspect-[3/4] overflow-hidden">
        {props.media.imageUrl ? (
          <Image
            alt={props.media.name}
            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
            height={200}
            src={props.media.imageUrl}
            width={300}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            {props.media.type === "book" ? (
              <BookIcon className="h-8 w-8 text-muted-foreground" />
            ) : (
              <Clapperboard className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
        )}
        {/* Add button overlay */}
        {!displayOnly && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            <Button onClick={handleAddToPlanning} size="sm" variant="secondary">
              <Plus className="h-3 w-3" />
              Add
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-3 pt-0">
        <h4 className="mb-1 line-clamp-2 font-medium text-xs">
          {props.media.name}
        </h4>
        {props.media.releaseYear && (
          <p className="text-muted-foreground text-xs">
            {props.media.releaseYear}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
