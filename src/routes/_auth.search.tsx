import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import SearchMediaTypeTabs from "@/components/search-media-type-tabs";
import SearchQueryInput from "@/components/search-query-input";
import SearchResultsPanel from "@/components/search-results-panel";
import { defaultMediaFilters } from "@/lib/media-filters";
import { searchUrlFiltersValidator } from "@/lib/search-url-filters";

export const Route = createFileRoute("/_auth/search")({
	validateSearch: searchUrlFiltersValidator,
	component: SearchPage,
});

function SearchPage() {
	const { type } = useSearch({ from: "/_auth/search" });

	return (
		<div className="flex flex-col space-y-14 pt-4">
			<Link
				className="inline-flex self-start"
				search={{ type, view: defaultMediaFilters.view }}
				to="/"
			>
				<span className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-ink">
					<ArrowLeftIcon className="size-4" />
					Back to library
				</span>
			</Link>

			<header className="space-y-3">
				<p className="eyebrow tracking-[0.18em]">Search</p>
				<h1 className="display text-4xl leading-[1.05] text-ink sm:text-4xl lg:text-5xl">
					Find your next.
				</h1>
			</header>

			<div className="space-y-6">
				<SearchQueryInput />
				<SearchMediaTypeTabs />
			</div>

			<SearchResultsPanel />
		</div>
	);
}
