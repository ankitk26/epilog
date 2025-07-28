import { z } from "zod";

export type FilterMediaView = "grid" | "kanban" | "list";

export const mediaTypes = ["anime", "movie", "tv", "book"] as const;
export type MediaType = (typeof mediaTypes)[number];

export const mediaSearchAPIOutput = z.object({
  results: z.array(
    z.object({
      id: z.number(),
      first_air_date: z.string().nullable().optional(),
      release_date: z.string().nullable().optional(),
      name: z.string().nullable().optional(),
      title: z.string().nullable().optional(),
      poster_path: z.string().nullable(),
      original_language: z.string().nullable().optional(),
    })
  ),
});

export type MediaSearchOutput = z.infer<typeof mediaSearchAPIOutput>;

export const animeSearchAPIOutput = z.object({
  data: z.array(
    z.object({
      mal_id: z.number(),
      images: z.object({
        webp: z.object({
          large_image_url: z.string(),
        }),
      }),
      title: z.string().nullable().optional(),
      title_english: z.string().nullable().optional(),
      aired: z.object({
        from: z.string().nullable().optional(),
      }),
    })
  ),
});
export type AnimeSearchOutput = z.infer<typeof animeSearchAPIOutput>;
