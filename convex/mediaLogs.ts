import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./model/users";

export const all = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const mediaLogs = await ctx.db
      .query("mediaLogs")
      .withIndex("user_and_media", (q) => q.eq("userId", userId))
      .collect();

    const rawMediaLogs = await Promise.all(
      mediaLogs.map(async (log) => {
        const media = await ctx.db.get(log.dbMediaId);
        return { ...log, metadata: media };
      })
    );

    const fullMediaLogs = rawMediaLogs
      .filter((log) => log.metadata != null)
      .map((log) => ({
        ...log,
        // biome-ignore lint/style/noNonNullAssertion: assert metadata not to be null
        metadata: log.metadata!,
      }));

    return fullMediaLogs;
  },
});

export const addToPlanning = mutation({
  args: {
    media: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    let mediaId: Id<"media">;

    // check if media is already present in the db
    const existingMedia = await ctx.db
      .query("media")
      .withIndex("sourceId", (q) =>
        q.eq("sourceMediaId", args.media.sourceMediaId)
      )
      .collect();

    if (existingMedia.length > 0) {
      mediaId = existingMedia[0]._id;
    } else {
      // create new media row and get its ID
      const newMediaId = await ctx.db.insert("media", {
        image: args.media.image,
        name: args.media.name,
        releaseYear: args.media.releaseYear,
        sourceMediaId: args.media.sourceMediaId,
        type: args.media.type,
      });
      mediaId = newMediaId;
    }

    // check if media is already logged
    const mediaLogCheck = await ctx.db
      .query("mediaLogs")
      .withIndex("user_and_media", (q) =>
        q.eq("userId", userId).eq("dbMediaId", mediaId)
      )
      .collect();

    // do nothing if everything already exists
    if (mediaLogCheck.length > 0) {
      return "Already added";
    }

    await ctx.db.insert("mediaLogs", {
      dbMediaId: mediaId,
      status: "planned",
      userId,
    });
    return "Added to planning";
  },
});

export const remove = mutation({
  args: {
    mediaLogId: v.id("mediaLogs"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const mediaLogDoc = await ctx.db.get(args.mediaLogId);

    // check if user trying to delete the doc is the doc's owner
    if (mediaLogDoc?.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.mediaLogId);
  },
});

export const updateStatus = mutation({
  args: {
    mediaLogId: v.id("mediaLogs"),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const mediaLogDoc = await ctx.db.get(args.mediaLogId);

    // check if user trying to delete the doc is the doc's owner
    if (mediaLogDoc?.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.mediaLogId, {
      status: args.status,
    });
  },
});

export const bulkUpdateStatus = mutation({
  args: {
    mediaLogIds: v.array(v.id("mediaLogs")),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    // Verify all media logs belong to the user
    const mediaLogs = await Promise.all(
      args.mediaLogIds.map((id) => ctx.db.get(id))
    );

    for (const mediaLog of mediaLogs) {
      if (!mediaLog || mediaLog.userId !== userId) {
        throw new Error("Unauthorized");
      }
    }

    // Update all media logs in parallel
    await Promise.all(
      args.mediaLogIds.map((id) =>
        ctx.db.patch(id, {
          status: args.status,
        })
      )
    );
  },
});

export const bulkDelete = mutation({
  args: {
    mediaLogIds: v.array(v.id("mediaLogs")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const mediaLogs = await Promise.all(
      args.mediaLogIds.map((id) => ctx.db.get(id))
    );

    // Verify all media logs belong to the user
    for (const mediaLog of mediaLogs) {
      if (!mediaLog || mediaLog.userId !== userId) {
        throw new Error("Unauthorized");
      }
    }

    // Delete all media logs in parallel
    await Promise.all(args.mediaLogIds.map((id) => ctx.db.delete(id)));
  },
});
