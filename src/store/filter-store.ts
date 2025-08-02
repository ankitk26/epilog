import { Store } from "@tanstack/react-store";
import type { FilterMediaView, MediaType } from "@/types";

type FilterStore = {
  type: MediaType;
  view: FilterMediaView;
};

export const filterStore = new Store<FilterStore>({
  type: "anime",
  view: "kanban",
});
