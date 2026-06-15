import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import SearchInput from "@/components/search-input";
import SearchMediaButtons from "@/components/search-media-buttons";
import SearchResults from "@/components/search-results";
import { Button } from "@/components/ui/button";
import { defaultMediaFilters, isMediaType } from "@/lib/media-filters";
import { searchStore } from "@/store/search-store";
import type { MediaType } from "@/types";

export const Route = createFileRoute("/_auth/search")({
	component: SearchPage,
});

function SearchPage() {
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	const backType: MediaType = isMediaType(mediaType)
		? mediaType
		: defaultMediaFilters.type;

	return (
		<div className="flex flex-col space-y-8">
			<Link
				className="inline-flex self-start"
				search={{ type: backType, view: defaultMediaFilters.view }}
				to="/"
			>
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
