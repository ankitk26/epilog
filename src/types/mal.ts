import { z } from "zod";

const malPicture = z
	.object({
		medium: z.string(),
		large: z.string(),
	})
	.nullable();

const malAlternativeTitles = z
	.object({
		synonyms: z.array(z.string()).nullable().optional(),
		en: z.string().nullable().optional(),
		ja: z.string().nullable().optional(),
	})
	.nullable()
	.optional();

export const malAnimeSearchAPIOutput = z.object({
	data: z.array(
		z.object({
			node: z.object({
				id: z.number(),
				title: z.string(),
				main_picture: malPicture,
				alternative_titles: malAlternativeTitles,
				start_date: z.string().nullable().optional(),
				studios: z
					.array(
						z.object({
							id: z.number(),
							name: z.string(),
						}),
					)
					.default([]),
			}),
		}),
	),
});
export type MalAnimeSearchOutput = z.infer<typeof malAnimeSearchAPIOutput>;

export const malMangaSearchAPIOutput = z.object({
	data: z.array(
		z.object({
			node: z.object({
				id: z.number(),
				title: z.string(),
				main_picture: malPicture,
				alternative_titles: malAlternativeTitles,
				start_date: z.string().nullable().optional(),
				authors: z
					.array(
						z.object({
							node: z.object({
								id: z.number(),
								first_name: z.string(),
								last_name: z.string(),
							}),
							role: z.string(),
						}),
					)
					.default([]),
				nsfw: z.enum(["white", "gray", "black"]).optional(),
			}),
		}),
	),
});
export type MalMangaSearchOutput = z.infer<typeof malMangaSearchAPIOutput>;
