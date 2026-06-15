import { Store } from "@tanstack/react-store";
import type { SearchMediaType } from "@/types";

type SearchStore = {
	searchQuery: string;
	mediaType: SearchMediaType;
};

export const searchStore = new Store<SearchStore>({
	searchQuery: "",
	mediaType: "anime",
});
