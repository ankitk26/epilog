import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
	filterMediaViews,
	type FilterMediaView,
	mediaTypes,
	type MediaType,
	type SearchMediaType,
} from "@/types";

export function isMediaType(type: SearchMediaType): type is MediaType {
	return (mediaTypes as readonly string[]).includes(type);
}

export const defaultMediaFilters = {
	type: "movie" as MediaType,
	view: "grid" as FilterMediaView,
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
	})
	.transform(({ type, view }) => ({
		type,
		view: normalizeMediaFilterView(type, view),
	}));

export type MediaFilters = z.output<typeof mediaFiltersSearchSchema>;

export const mediaFiltersSearchValidator = zodValidator({
	schema: mediaFiltersSearchSchema,
	input: "input",
	output: "output",
});
