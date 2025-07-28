import SearchInput from "@/components/search-input";
import SearchMediaButtons from "@/components/search-media-buttons";
import SearchResults from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

export const Route = createFileRoute("/_auth/search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="space-y-8 flex flex-col">
      <Link to="/">
        <Button size="sm" className="text-xs" variant="secondary">
          <ArrowLeftIcon />
          Go back
        </Button>
      </Link>
      <SearchMediaButtons />
      <SearchInput />
      <SearchResults />
    </div>
  );
}
