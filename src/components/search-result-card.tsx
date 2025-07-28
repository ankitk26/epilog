import { MediaSearchOutput } from "@/types";
import { Clapperboard, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type Props = {
  media: MediaSearchOutput["results"][number];
};

export default function SearchResultCard(props: Props) {
  const handleAddToStaging = () => {
    // Add your staging logic here
    console.log("Adding to staging:", props.media);
  };

  const fullPosterPath = `https://image.tmdb.org/t/p/w500${props.media.poster_path}`;

  return (
    <Card
      key={props.media.id}
      className="group overflow-hidden transition-shadow duration-200 hover:shadow-md p-0"
    >
      <div className="aspect-[3/4] relative overflow-hidden">
        {props.media.poster_path ? (
          <img
            src={fullPosterPath}
            alt={props.media.name ?? props.media.title ?? "Media poster"}
            className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Clapperboard className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        {/* Add button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-sm">
          <Button variant="secondary" size="sm" onClick={handleAddToStaging}>
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
      </div>
      <CardContent className="p-2">
        <h4 className="font-medium text-xs line-clamp-2 mb-1">
          {props.media.name ?? props.media.title ?? "Untitled"}
        </h4>
        {props.media.release_date && (
          <p className="text-xs text-muted-foreground">
            {new Date(props.media.release_date).getFullYear()}
          </p>
        )}
        {props.media.first_air_date && (
          <p className="text-xs text-muted-foreground">
            {new Date(props.media.first_air_date).getFullYear()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
