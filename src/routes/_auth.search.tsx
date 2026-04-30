import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SearchInput from "@/components/search-input";
import SearchMediaButtons from "@/components/search-media-buttons";
import SearchResults from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { defaultMediaFilters } from "@/lib/media-filters";

export const Route = createFileRoute("/_auth/search")({
	component: SearchPage,
});

function SearchPage() {
	return (
		<div className="flex flex-col space-y-8">
			<Link search={defaultMediaFilters} to="/">
				<Button className="text-xs" size="sm" variant="secondary">
					<ArrowLeftIcon />
					Go back
				</Button>
			</Link>
			<SearchInput />
			<SearchMediaButtons />
			<SearchResults />
		</div>
	);
}
