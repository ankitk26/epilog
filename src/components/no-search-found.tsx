import { useStore } from "@tanstack/react-store";
import { BookIcon, ClapperboardIcon } from "lucide-react";
import { searchStore } from "@/store/search-store";

export default function NoSearchFound() {
  const mediaType = useStore(searchStore, (state) => state.mediaType);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {mediaType === "book" ? (
        <BookIcon className="mb-2 h-8 w-8 text-muted-foreground" />
      ) : (
        <ClapperboardIcon className="mb-2 h-8 w-8 text-muted-foreground" />
      )}
      <p className="text-muted-foreground text-sm">No results found</p>
      <p className="text-muted-foreground text-xs">
        Try a different search term
      </p>
    </div>
  );
}
