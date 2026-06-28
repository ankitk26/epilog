import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { mediaTypes } from "@/types";

export const defaultSearchUrlFilters = {
	q: "",
	type: "anime" as const,
};

const searchParamsSchema = z.object({
	q: z
		.string()
		.optional()
		.catch(defaultSearchUrlFilters.q)
		.transform((value) => value ?? defaultSearchUrlFilters.q),
	type: z
		.enum(mediaTypes)
		.optional()
		.catch(defaultSearchUrlFilters.type)
		.transform((value) => value ?? defaultSearchUrlFilters.type),
});

export type SearchUrlFilters = z.output<typeof searchParamsSchema>;

export const searchUrlFiltersValidator = zodValidator({
	schema: searchParamsSchema,
	input: "input",
	output: "output",
});
