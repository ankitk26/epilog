import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
	filterMediaViews,
	type FilterMediaView,
	logStatuses,
	mediaTypes,
	type MediaType,
	validStatusesByMediaType,
} from "@/types";
import type { LogStatus } from "@/types";

export const defaultMediaFilters = {
	type: "movie",
	view: "grid",
} satisfies { type: MediaType; view: FilterMediaView };

// The status filter defaults to whatever is "in progress" for the media type.
export const currentStatusByMediaType = {
	book: "reading",
	manga: "reading",
	movie: "watching",
	tv: "watching",
	anime: "watching",
} satisfies Record<MediaType, LogStatus>;

// Resolves the URL status param to a concrete status:
// - absent → the type's in-progress status (watching/reading)
// - a status that doesn't apply to the type → back to the default
type StatusFilterParam = LogStatus;

export const normalizeStatusFilter = (
	type: MediaType,
	status: StatusFilterParam | undefined,
): StatusFilterParam => {
	if (status && validStatusesByMediaType[type].has(status)) {
		return status;
	}

	return currentStatusByMediaType[type];
};

// Calendar is only supported for movies, so invalid combinations fall back
// to the same grid default the old store used.
export const normalizeMediaFilterView = (
	type: MediaType,
	view: FilterMediaView,
) => {
	if (type !== "movie" && view === "calendar") {
		return defaultMediaFilters.view;
	}

	return view;
};

// URL inputs stay optional, but route consumers always receive normalized
// defaults after validation.
const mediaFiltersSearchSchema = z
	.object({
		type: z
			.enum(mediaTypes)
			.optional()
			.catch(defaultMediaFilters.type)
			.transform((value) => value ?? defaultMediaFilters.type),
		view: z
			.enum(filterMediaViews)
			.optional()
			.catch(defaultMediaFilters.view)
			.transform((value) => value ?? defaultMediaFilters.view),
		status: z.enum(logStatuses).optional().catch(undefined),
	})
	.transform(({ type, view, status }) => ({
		type,
		view: normalizeMediaFilterView(type, view),
		status: normalizeStatusFilter(type, status),
	}));

export const mediaFiltersSearchValidator = zodValidator({
	schema: mediaFiltersSearchSchema,
	input: "input",
	output: "output",
});
