import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FilterMediaView, MediaType } from "@/types";

type FilterStore = {
  type: MediaType;
  view: FilterMediaView;
  setType: (type: MediaType) => void;
  setView: (view: FilterMediaView) => void;
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      type: "anime",
      view: "kanban",
      setType: (type: MediaType) => set({ type }),
      setView: (view: FilterMediaView) => set({ view }),
    }),
    { name: "epilog-filters" }
  )
);
