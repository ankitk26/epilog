import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  media: defineTable({
    image: v.string(),
    name: v.string(),
    releaseDate: v.string(),
    sourceMediaId: v.string(),
    type: v.union(
      v.literal("anime"),
      v.literal("movie"),
      v.literal("tv"),
      v.literal("book")
    ),
  }).index("media", ["sourceMediaId", "type"]),

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
    .index("user", ["userId"]),
});
