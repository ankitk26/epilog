import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // this table will only have _id and _creationTime
  }),

  media: defineTable({
    name: v.string(),
    image: v.optional(v.string()),
    releaseYear: v.union(v.number(), v.null()),
    sourceMediaId: v.string(),
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
    userId: v.id("users"),
    dbMediaId: v.id("media"),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  })
    .index("media", ["dbMediaId", "status"])
    .index("user_and_media", ["userId", "dbMediaId"]),

  logs: defineTable({
    userId: v.id("users"),
    dbMediaId: v.id("media"),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  })
    .index("by_media_and_status", ["dbMediaId", "status"])
    .index("by_user_and_mediaId", ["userId", "dbMediaId"]),
});
