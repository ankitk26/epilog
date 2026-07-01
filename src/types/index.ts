import { z } from "zod";

export const filterMediaViews = ["grid", "shelf", "list", "calendar"] as const;
export type FilterMediaView = (typeof filterMediaViews)[number];

export const mediaTypes = ["movie", "tv", "anime", "book", "manga"] as const;
export type MediaType = (typeof mediaTypes)[number];

export const logStatuses = [
	"tbr",
	"reading",
	"finished",
	"dnf",
	"watchlist",
	"watching",
	"watched",
	"plan_to_watch",
	"waiting",
	"completed",
	"dropped",
] as const;
export type LogStatus = (typeof logStatuses)[number];

export const statusesByMediaType: Record<MediaType, LogStatus[]> = {
	book: ["tbr", "reading", "finished", "dnf"],
	manga: ["tbr", "reading", "finished", "dnf"],
	movie: ["watchlist", "watching", "watched"],
	tv: ["plan_to_watch", "watching", "waiting", "completed", "dropped"],
	anime: ["plan_to_watch", "watching", "waiting", "completed", "dropped"],
};

export const defaultStatusByMediaType: Record<MediaType, LogStatus> = {
	book: "tbr",
	manga: "tbr",
	movie: "watchlist",
	tv: "plan_to_watch",
	anime: "plan_to_watch",
};

export const mediaSearchAPIOutput = z.object({
	results: z.array(
		z.object({
			id: z.number(),
			first_air_date: z.string().nullable().optional(),
			release_date: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
			title: z.string().nullable().optional(),
			poster_path: z.string().nullable().optional(),
			original_language: z.string().nullable().optional(),
		}),
	),
});

export type MediaSearchOutput = z.infer<typeof mediaSearchAPIOutput>;

export const animeSearchAPIOutput = z.object({
	data: z.array(
		z.object({
			mal_id: z.number(),
			images: z.object({
				jpg: z.object({
					large_image_url: z.string(),
				}),
				webp: z.object({
					large_image_url: z.string(),
				}),
			}),
			title: z.string().nullable().optional(),
			title_english: z.string().nullable().optional(),
			aired: z.object({
				from: z.string().nullable().optional(),
			}),
		}),
	),
});
export type AnimeSearchOutput = z.infer<typeof animeSearchAPIOutput>;

export const jikanMangaSearchAPIOutput = z.object({
	data: z.array(
		z.object({
			mal_id: z.number(),
			images: z.object({
				jpg: z.object({
					large_image_url: z.string(),
				}),
				webp: z.object({
					large_image_url: z.string(),
				}),
			}),
			title: z.string().nullable().optional(),
			title_english: z.string().nullable().optional(),
			published: z.object({
				from: z.string().nullable().optional(),
			}),
		}),
	),
});
export type JikanMangaSearchOutput = z.infer<typeof jikanMangaSearchAPIOutput>;

/*
export const bookSearchAPIOutput = z.object({
	items: z
		.array(
			z.object({
				id: z.string(),
				volumeInfo: z.object({
					title: z.string().nullable().optional(),
					subtitle: z.string().nullable().optional(),
					imageLinks: z
						.object({
							thumbnail: z.string().nullable().optional(),
							small: z.string().nullable().optional(),
							medium: z.string().nullable().optional(),
							large: z.string().nullable().optional(),
						})
						.optional(),
					publishedDate: z.string().nullable().optional(),
				}),
			}),
		)
		.optional()
		.default([]),
});
export type BookSearchOutput = z.infer<typeof bookSearchAPIOutput>;
*/

export const openLibraryBookSearchAPIOutput = z.object({
	numFound: z.number(),
	docs: z.array(
		z.object({
			key: z.string(),
			title: z.string(),
			author_name: z.array(z.string()).optional(),
			author_alternative_name: z.array(z.string()).optional(),
			author_key: z.array(z.string()).optional(),
			cover_i: z.number().optional(),
			first_publish_year: z.number().optional(),
			series_key: z.array(z.string()).optional(),
			series_name: z.array(z.string()).optional(),
			series_position: z.array(z.string()).optional(),
			editions: z
				.object({
					docs: z.array(
						z.object({
							key: z.string().optional(),
							title: z.string().optional(),
							cover_i: z.number().optional(),
							language: z.array(z.string()).optional(),
							publish_year: z.array(z.number()).optional(),
						}),
					),
				})
				.optional(),
		}),
	),
});

export const bookSearchAPIOutput = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			author: z.string().nullable(),
			imageUrl: z.string().nullable(),
			publishYear: z.number().nullable(),
			seriesName: z.string().nullable(),
			seriesPosition: z.number().nullable(),
			seriesTotal: z.number().nullable(),
			seriesKey: z.string().nullable(),
		}),
	),
});

export type BookSearchOutput = z.infer<typeof bookSearchAPIOutput>;
