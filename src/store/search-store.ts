import { Store } from "@tanstack/react-store";
import type { MediaType } from "@/types";

type SearchStore = {
  searchQuery: string;
  mediaType: MediaType;
};

export const searchStore = new Store<SearchStore>({
  searchQuery: "",
  mediaType: "anime",
});
