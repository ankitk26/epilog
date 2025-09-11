import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { type AnimeSearchOutput, animeSearchAPIOutput } from "@/types";

export const getAnimeSearchResults = createServerFn({ method: "GET" })
  .validator(z.object({ searchQuery: z.string() }))
  .handler(async ({ data }) => {
    const { data: animeContent, error } = await betterFetch(
      "https://api.jikan.moe/v4/anime",
      {
        method: "GET",
        query: {
          q: data.searchQuery,
        },
        output: animeSearchAPIOutput,
      }
    );

    if (error) {
      console.error(error.message);
      return { data: [] } as AnimeSearchOutput;
    }

    return animeContent;
  });
