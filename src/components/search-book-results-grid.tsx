import { useQuery } from "@tanstack/react-query";
import { searchOpenLibraryBooks } from "@/actions/search-open-library-books";
import SearchMediaListItem from "@/components/search-media-list-item";
import SearchNoResultsEmptyState from "@/components/search-no-results-empty-state";
import SearchResultsLoadingList from "@/components/search-results-loading-list";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import type { SearchMedia } from "./search-results-panel";

type Props = {
	onMediaClick: (media: SearchMedia) => void;
	query: string;
};

export default function SearchBookResultsGrid({
	onMediaClick,
	query: searchQuery,
}: Props) {
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
		enabled: searchQuery.length > 0,
		staleTime: 1000 * 60 * 2,
	});

	if (isEnabled && isPending) {
		return <SearchResultsLoadingList />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!books || books.length === 0) {
		return <SearchNoResultsEmptyState type="book" />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{books.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>

			<div className="flex flex-col gap-1">
				{books.map((book) => {
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
						<SearchMediaListItem
							key={book.id}
							media={{
								...searchMedia,
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
