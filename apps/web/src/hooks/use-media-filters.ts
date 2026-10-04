import { useNavigate, useSearch } from "@tanstack/react-router";
import { useProfileMediaTypes } from "@/hooks/use-profile-media-types";
import {
	defaultMediaFilters,
	normalizeMediaFilterView,
	normalizeStatusFilter,
} from "@/lib/media-filters";
import type { FilterMediaView, LogStatus, MediaType } from "@/types";

export function useMediaFilters() {
	// Not tied to a route: the hook is consumed by shared chrome (the
	// search sheet) that also renders outside "/_auth/", where the index
	// route has no active match.
	const search = useSearch({ strict: false });
	const navigate = useNavigate();
	const { enabled, isReady } = useProfileMediaTypes();

	// While the profile is loading we cannot validate the type yet, so the
	// URL type is used as-is. Once ready, a type disabled in settings is
	// derived away immediately — no wrong-content frame and no redirect.
	const urlType = search.type ?? defaultMediaFilters.type;
	const type = isReady
		? enabled.includes(urlType)
			? urlType
			: (enabled[0] ?? defaultMediaFilters.type)
		: urlType;
	const view = normalizeMediaFilterView(
		type,
		search.view ?? defaultMediaFilters.view,
	);
	// Normalizing against the effective type also covers the profile-loading
	// window, where the URL type may be swapped for the first enabled one.
	const status = normalizeStatusFilter(type, search.status);

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

	const setStatus = (nextStatus: LogStatus) => {
		void navigate({
			replace: true,
			search: (prev) => ({
				type: prev.type ?? defaultMediaFilters.type,
				view: normalizeMediaFilterView(
					prev.type ?? defaultMediaFilters.type,
					prev.view ?? defaultMediaFilters.view,
				),
				status: nextStatus,
			}),
		});
	};

	return {
		type,
		view,
		status,
		setType,
		setView,
		setStatus,
	};
}
