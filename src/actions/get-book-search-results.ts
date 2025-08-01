import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { type BookSearchOutput, bookSearchAPIOutput } from "@/types";

export const getBookSearchResults = createServerFn({ method: "GET" })
  .validator(z.object({ searchQuery: z.string() }))
  .handler(async ({ data }) => {
    const { data: books, error } = await betterFetch(
      "https://api.jikan.moe/v4/manga",
      {
        method: "GET",
        query: {
          q: data.searchQuery,
          limit: 25,
          sfw: true,
        },
        output: bookSearchAPIOutput,
      }
    );

    if (error) {
      console.error(error.message);
      return { data: [] } as BookSearchOutput;
    }

    return books;
  });
