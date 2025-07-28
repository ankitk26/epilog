import { MediaType } from "@/types";
import { create } from "zustand";

type SearchStore = {
  searchQuery: string;
  mediaType: MediaType;
  setSearchQuery: (query: string) => void;
  setMediaType: (type: MediaType) => void;
};

export const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query: string) => set({ searchQuery: query }),
  mediaType: "anime",
  setMediaType: (type: MediaType) => set({ mediaType: type }),
}));
