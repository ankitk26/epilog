import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import SearchInput from "@/components/search-input";
import SearchMediaButtons from "@/components/search-media-buttons";
import SearchResults from "@/components/search-results";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/search")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.mediaLogs.all, {})
    );
  },
  component: SearchPage,
});

function SearchPage() {
  return (
    <div className="flex flex-col space-y-8">
      <Link to="/">
        <Button className="text-xs" size="sm" variant="secondary">
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
