import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { mediaSearchAPIOutput, mediaTypes } from "@/types";

export const getContentSearchResults = createServerFn({ method: "GET" })
  .validator(
    z.object({
      searchQuery: z.string(),
      mediaType: z.enum(mediaTypes),
    })
  )
  .handler(async ({ data }) => {
    let searchType = "tv";
    if (data.mediaType === "movie") {
      searchType = "movie";
    }

    const TMDB_TOKEN = process.env.TMDB_TOKEN;

    const { data: mediaContent } = await betterFetch(
      `https://api.themoviedb.org/3/search/${searchType}`,
      {
        method: "GET",
        query: {
          query: data.searchQuery,
        },
        headers: {
          authorization: `Bearer ${TMDB_TOKEN}`,
        },
        output: mediaSearchAPIOutput,
      }
    );

    return mediaContent;
  });
