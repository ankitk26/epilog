import { useStore } from "@tanstack/react-store";
import { filterStore } from "@/store/filter-store";

export default function EmptyStateMessage() {
  const mediaType = useStore(filterStore, (state) => state.type);
  if (mediaType === "book") {
    return "No books yet. Add one to begin your reading list";
  }
  if (mediaType === "movie") {
    return "No movies yet. Add one to start tracking";
  }
  return "No shows yet. Add one to start tracking";
}
