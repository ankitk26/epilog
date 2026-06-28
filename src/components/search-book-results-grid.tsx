import { useQuery } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { searchOpenLibraryBooks } from "@/actions/search-open-library-books";
import MediaPosterCard from "@/components/media-poster-card";
import SearchNoResultsEmptyState from "@/components/search-no-results-empty-state";
import SearchResultsLoadingGrid from "@/components/search-results-loading-grid";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import type { SearchMedia } from "./search-results-panel";

type Props = {
	onMediaClick: (media: SearchMedia) => void;
};

export default function SearchBookResultsGrid({ onMediaClick }: Props) {
	const { q: searchQuery, type: mediaType } = useSearch({
		from: "/_auth/search",
	});

	const {
		data: books,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "book", searchQuery],
		queryFn: async () => {
			const results = await searchOpenLibraryBooks({
				data: { searchQuery },
			});
			return results.data;
		},
		enabled: searchQuery.length > 0 && mediaType === "book",
		staleTime: 1000 * 60 * 2,
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingGrid />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!books || books.length === 0) {
		return <SearchNoResultsEmptyState />;
	}

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{books.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>

			<div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-4">
				{books.map((book) => {
					let displayTitle = book.title;
					if (book.seriesName && book.seriesPosition) {
						displayTitle = `${book.title} (${book.seriesName}, #${book.seriesPosition})`;
					} else if (book.seriesName) {
						displayTitle = `${book.title} (${book.seriesName})`;
					}

					const searchMedia: SearchMedia = {
						imageUrl: book.imageUrl,
						name: book.title,
						releaseYear: book.publishYear,
						sourceId: buildSourceMediaId("book", book.id),
						type: "book",
						seriesName: book.seriesName ?? undefined,
						seriesPosition: book.seriesPosition ?? undefined,
						seriesTotal: book.seriesTotal ?? undefined,
						seriesKey: book.seriesKey ?? undefined,
					};

					return (
						<MediaPosterCard
							displayOnly
							key={book.id}
							media={{
								...searchMedia,
								name: displayTitle,
								secondaryText: book.author,
							}}
							onClick={() => onMediaClick(searchMedia)}
						/>
					);
				})}
			</div>
		</div>
	);
}
