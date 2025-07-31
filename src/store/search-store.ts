import { MediaType } from "@/types";
import { Store } from "@tanstack/react-store";

type SearchStore = {
  searchQuery: string;
  mediaType: MediaType;
};

export const searchStore = new Store<SearchStore>({
  searchQuery: "",
  mediaType: "anime",
});
