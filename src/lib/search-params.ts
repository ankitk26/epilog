import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { mediaTypes } from "@/types";

export const defaultSearchParams = {
	q: "",
	type: "anime" as const,
};

const searchParamsSchema = z.object({
	q: z
		.string()
		.optional()
		.catch(defaultSearchParams.q)
		.transform((value) => value ?? defaultSearchParams.q),
	type: z
		.enum(mediaTypes)
		.optional()
		.catch(defaultSearchParams.type)
		.transform((value) => value ?? defaultSearchParams.type),
});

export type SearchParams = z.output<typeof searchParamsSchema>;

export const searchParamsValidator = zodValidator({
	schema: searchParamsSchema,
	input: "input",
	output: "output",
});
