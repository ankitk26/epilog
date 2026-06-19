import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useSelector } from "@tanstack/react-store";
import SearchInput from "@/components/search-input";
import SearchMediaButtons from "@/components/search-media-buttons";
import SearchResults from "@/components/search-results";
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
		<div className="flex flex-col space-y-10 pt-2">
			<Link
				className="inline-flex self-start"
				search={{ type: backType, view: defaultMediaFilters.view }}
				to="/"
			>
				<span className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink">
					<ArrowLeftIcon className="size-4" />
					Back to library
				</span>
			</Link>

			<header className="space-y-3">
				<p className="eyebrow tracking-[0.18em]">Search</p>
				<h1 className="display text-[2.25rem] leading-[1.05] text-ink sm:text-4xl lg:text-5xl">
					Find your next.
				</h1>
			</header>

			<div className="space-y-6">
				<SearchInput />
				<SearchMediaButtons />
			</div>

			<SearchResults />
		</div>
	);
}
