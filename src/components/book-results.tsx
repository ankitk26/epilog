import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { getBookSearchResults } from "@/actions/get-book-search-results";
import MediaCard from "@/components/media-card";
import NoSearchFound from "@/components/no-search-found";
import SearchLoading from "@/components/search-loading";
import { buildSourceMediaId } from "@/lib/source-media-id";
import { searchStore } from "@/store/search-store";

export default function BookResults() {
	const searchQuery = useSelector(searchStore, (state) => state.searchQuery);
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	const {
		data: books,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "book", mediaType, searchQuery],
		queryFn: async () =>
			await getBookSearchResults({ data: { searchQuery } }),
		enabled: searchQuery.length !== 0 && mediaType === "book",
	});

	if (isEnabled && isPending) {
		return <SearchLoading />;
	}

	if (!searchQuery) {
		return null;
	}

	if (!books || books.data.length === 0) {
		return <NoSearchFound />;
	}

	return (
		<div className="space-y-5">
			<div className="flex items-center gap-4">
				<h3 className="eyebrow tracking-[0.16em]">Search Results</h3>
				<span className="text-sm text-muted-foreground tabular-nums">
					{books.data.length} found
				</span>
				<div className="h-px flex-1 bg-hairline" />
			</div>

			<div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] lg:gap-x-4">
				{books.data.map((book) => (
					<MediaCard
						key={book.id}
						media={{
							imageUrl: book.imageUrl,
							name: book.title,
							secondaryText: book.author,
							releaseYear: book.publishYear,
							sourceId: buildSourceMediaId("book", book.id),
							type: "book",
							seriesName: book.seriesName ?? undefined,
							seriesPosition: book.seriesPosition ?? undefined,
							seriesTotal: book.seriesTotal ?? undefined,
							seriesKey: book.seriesKey ?? undefined,
						}}
					/>
				))}
			</div>
		</div>
	);
}
