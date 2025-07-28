import type { FilterMediaType, FilterMediaView } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FilterStore = {
  type: FilterMediaType;
  view: FilterMediaView;
  setType: (type: FilterMediaType) => void;
  setView: (view: FilterMediaView) => void;
};

export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      type: "anime",
      view: "kanban",
      setType: (type: FilterMediaType) => set({ type }),
      setView: (view: FilterMediaView) => set({ view }),
    }),
    { name: "epilog-filters" }
  )
);
