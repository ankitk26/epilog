import { useQuery } from "@tanstack/react-query";
import { useSelector } from "@tanstack/react-store";
import { getBookSearchResults } from "@/actions/get-book-search-results";
import MediaCard from "@/components/media-card";
import NoSearchFound from "@/components/no-search-found";
import SearchLoading from "@/components/search-loading";
import { Badge } from "@/components/ui/badge";
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
		<div className="space-y-3">
			<div className="flex items-center space-x-4">
				<h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
					Search Results
				</h3>
				<Badge className="text-xs" variant="secondary">
					{books.data.length} found
				</Badge>
			</div>

			<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] lg:gap-4">
				{books.data.map((book) => (
					<MediaCard
						key={book.id}
						media={{
							imageUrl: book.imageUrl,
							name: book.title,
							secondaryText: book.author,
							releaseYear: book.publishYear,
							sourceId: book.id,
							type: "book",
						}}
					/>
				))}
			</div>
		</div>
	);
}
