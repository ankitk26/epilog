import { useStore } from "@tanstack/react-store";
import { searchStore } from "@/store/search-store";
import IconByType from "./icon-by-type";

export default function NoSearchFound() {
  const mediaType = useStore(searchStore, (state) => state.mediaType);

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <IconByType
        className="mb-2 size-8 text-muted-foreground"
        type={mediaType}
      />
      <p className="text-muted-foreground text-sm">No results found</p>
      <p className="text-muted-foreground text-xs">
        Try a different search term
      </p>
    </div>
  );
}
