import { useMediaFilters } from "@/hooks/use-media-filters";

export default function EmptyStateMessage() {
	const { type: mediaType } = useMediaFilters();
	if (mediaType === "book") {
		return "No books yet. Add one to begin your reading list";
	}
	if (mediaType === "movie") {
		return "No movies yet. Add one to start tracking";
	}
	return "No shows yet. Add one to start tracking";
}
