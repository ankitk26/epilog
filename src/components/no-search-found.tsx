import { ClapperboardIcon } from "lucide-react";

export default function NoSearchFound() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <ClapperboardIcon className="h-8 w-8 text-muted-foreground mb-2" />
      <p className="text-sm text-muted-foreground">No results found</p>
      <p className="text-xs text-muted-foreground">
        Try a different search term
      </p>
    </div>
  );
}
