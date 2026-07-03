import { useNavigate, useSearch } from "@tanstack/react-router";
import {
	defaultMediaFilters,
	normalizeMediaFilterView,
} from "@/lib/media-filters";
import type { FilterMediaView, MediaType } from "@/types";

export function useMediaFilters() {
	const search = useSearch({ from: "/_auth/" });
	const navigate = useNavigate({ from: "/" });

	const type = search.type;
	const view = normalizeMediaFilterView(search.type, search.view);

	const setType = (nextType: MediaType) => {
		void navigate({
			replace: true,
			search: (prev) => ({
				type: nextType,
				view: normalizeMediaFilterView(
					nextType,
					prev.view ?? defaultMediaFilters.view,
				),
			}),
		});
	};

	const setView = (nextView: FilterMediaView) => {
		void navigate({
			replace: true,
			search: (prev) => ({
				type: prev.type ?? defaultMediaFilters.type,
				view: normalizeMediaFilterView(
					prev.type ?? defaultMediaFilters.type,
					nextView,
				),
			}),
		});
	};

	return {
		type,
		view,
		setType,
		setView,
	};
}
