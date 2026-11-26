import { z } from "zod";

export const filterMediaViews = ["grid", "list", "calendar"] as const;
export type FilterMediaView = (typeof filterMediaViews)[number];

export {
	mediaTypes,
	shelfStatusesByMediaType,
	statusesByMediaType,
	validStatusesByMediaType,
} from "../lib/media-statuses";
export type { LogStatus, MediaType } from "../lib/media-statuses";
import { mediaStatusConfig, mediaTypes } from "../lib/media-statuses";
import type { LogStatus } from "../lib/media-statuses";

export const logStatuses = Object.keys(mediaStatusConfig).filter(
	(status): status is LogStatus => status in mediaStatusConfig,
);

// The single uniform search contract: every search action (tmdb, mal,
// open library, …) maps its provider payload into SearchMedia server-side
// and returns { data: SearchMedia[] }. Clients never see provider-specific
// fields, so swapping a provider never touches consumers.
export const searchMediaAPIOutput = z.object({
	imageUrl: z.string().nullable(),
	name: z.string(),
	releaseYear: z.number().nullable(),
	sourceId: z.string(),
	type: z.enum(mediaTypes),
	creator: z.string().nullable(),
	bookAuthorId: z.string().nullable(),
});

export const searchMediaListAPIOutput = z.object({
	data: z.array(searchMediaAPIOutput),
});

export type SearchMedia = z.infer<typeof searchMediaAPIOutput>;
export type SearchMediaListOutput = z.infer<typeof searchMediaListAPIOutput>;

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
					large_image_url: z.string().nullable(),
				}),
				webp: z.object({
					large_image_url: z.string().nullable(),
				}),
			}),
			title: z.string().nullable().optional(),
			title_english: z.string().nullable().optional(),
			aired: z.object({
				from: z.string().nullable().optional(),
			}),
			studios: z
				.array(
					z.object({
						name: z.string(),
					}),
				)
				.default([]),
		}),
	),
});
export type AnimeSearchOutput = z.infer<typeof animeSearchAPIOutput>;

export const mangaSearchAPIOutput = z.object({
	data: z.array(
		z.object({
			mal_id: z.number(),
			images: z.object({
				jpg: z.object({
					large_image_url: z.string().nullable(),
				}),
				webp: z.object({
					large_image_url: z.string().nullable(),
				}),
			}),
			title: z.string().nullable().optional(),
			title_english: z.string().nullable().optional(),
			published: z.object({
				from: z.string().nullable().optional(),
			}),
			authors: z
				.array(
					z.object({
						name: z.string(),
					}),
				)
				.default([]),
		}),
	),
});
export type MangaSearchOutput = z.infer<typeof mangaSearchAPIOutput>;

/*
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

export const openLibraryWorkEditionsAPIOutput = z.object({
	entries: z
		.array(
			z.object({
				key: z.string().optional(),
				title: z.string().nullable().optional(),
				covers: z.array(z.number()).optional(),
				languages: z
					.array(z.union([z.string(), z.object({ key: z.string() })]))
					.optional(),
				publication_date: z.string().nullable().optional(),
			}),
		)
		.optional()
		.default([]),
});

export type BookEditionOutput = z.infer<
	typeof openLibraryWorkEditionsAPIOutput
>;

export const openLibraryAuthorAPIOutput = z.object({
	name: z.string().optional(),
	alternate_names: z.array(z.string()).optional(),
	photos: z.array(z.number()).optional(),
});

export type OpenLibraryAuthorOutput = z.infer<
	typeof openLibraryAuthorAPIOutput
>;

export const openLibraryWorkSearchAPIOutput = z.object({
	numFound: z.number(),
	docs: z.array(
		z.object({
			key: z.string(),
			first_publish_year: z.number().optional(),
			editions: z
				.object({
					docs: z.array(
						z.object({
							title: z.string().nullable().optional(),
							cover_i: z.number().optional(),
							language: z.array(z.string()).optional(),
							format: z.array(z.string()).optional(),
						}),
					),
				})
				.optional(),
		}),
	),
});

export type OpenLibraryWorkSearchOutput = z.infer<
	typeof openLibraryWorkSearchAPIOutput
>;

export const authorWorksOutput = z.object({
	data: z.object({
		author: z.object({
			id: z.string(),
			name: z.string(),
			imageUrl: z.string().nullable(),
		}),
		works: z.array(
			z.object({
				id: z.string(),
				title: z.string(),
				imageUrl: z.string().nullable(),
				publishYear: z.number().nullable(),
			}),
		),
	}),
});

export type AuthorWorksOutput = z.infer<typeof authorWorksOutput>;
