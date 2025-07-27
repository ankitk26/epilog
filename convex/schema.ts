import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  mediaLogs: defineTable({
    userId: v.string(),
    mediaId: v.string(),
    mediaType: v.union(v.literal("anime")),
    status: v.union(
      v.literal("to watch"),
      v.literal("watching"),
      v.literal("completed")
    ),
  }),
});
