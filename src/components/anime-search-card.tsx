import { AnimeSearchOutput } from "@/types";
import { Clapperboard, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type Props = {
  anime: AnimeSearchOutput["data"][0];
};

export default function AnimeSearchResultCard(props: Props) {
  const handleAddToStaging = () => {
    console.log("Adding to staging:", props.anime);
  };

  return (
    <Card className="group overflow-hidden transition-shadow duration-200 hover:shadow-md p-0">
      <div className="aspect-[3/4] relative overflow-hidden">
        {props.anime.images.webp?.large_image_url ? (
          <img
            src={props.anime.images.webp?.large_image_url}
            alt={props.anime.title_english ?? "Anime poster"}
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
          {props.anime.title_english ?? props.anime.title ?? "Untitled"}
        </h4>
        {props.anime.aired.from && (
          <p className="text-xs text-muted-foreground">
            {new Date(props.anime.aired.from).getFullYear()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
