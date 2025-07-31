import { ClapperboardIcon } from "lucide-react";

export default function NoSearchFound() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <ClapperboardIcon className="mb-2 h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground text-sm">No results found</p>
      <p className="text-muted-foreground text-xs">
        Try a different search term
      </p>
    </div>
  );
}
