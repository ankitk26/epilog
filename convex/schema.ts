import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  media: defineTable({
    name: v.string(),
    image: v.optional(v.string()),
    releaseYear: v.union(v.number(), v.null()),
    sourceMediaId: v.number(),
    type: v.union(
      v.literal("anime"),
      v.literal("movie"),
      v.literal("tv"),
      v.literal("book")
    ),
  })
    .index("media", ["sourceMediaId", "type"])
    .index("sourceId", ["sourceMediaId"]),

  mediaLogs: defineTable({
    userId: v.string(),
    dbMediaId: v.id("media"),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  })
    .index("media", ["dbMediaId", "status"])
    .index("user_and_media", ["userId", "dbMediaId"]),
});
