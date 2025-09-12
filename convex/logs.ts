import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./model/users";

export const all = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const logs = await ctx.db
      .query("logs")
      .withIndex("by_user_and_mediaId", (q) => q.eq("userId", userId))
      .collect();

    const rawLogs = await Promise.all(
      logs.map(async (log) => {
        const media = await ctx.db.get(log.dbMediaId);
        return { ...log, metadata: media };
      })
    );

    const finalLogs = rawLogs
      .filter((log) => log.metadata !== null)
      .map((log) => ({
        ...log,
        // biome-ignore lint/style/noNonNullAssertion: metadata will never be null
        metadata: log.metadata!,
      }));

    return finalLogs;
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

    // check if media entry exists
    const existingMedia = await ctx.db
      .query("media")
      .withIndex("sourceId", (q) =>
        q.eq("sourceMediaId", args.media.sourceMediaId)
      )
      .first();

    if (existingMedia) {
      // assign alredy existing id to mediaId
      mediaId = existingMedia[0]._id;
    } else {
      // create new media entry and get its ID
      const newMediaId = await ctx.db.insert("media", {
        image: args.media.image,
        name: args.media.name,
        releaseYear: args.media.releaseYear,
        sourceMediaId: args.media.sourceMediaId,
        type: args.media.type,
      });
      mediaId = newMediaId;
    }

    // check if media is already logged by current user
    const existingLog = await ctx.db
      .query("logs")
      .withIndex("by_user_and_mediaId", (q) =>
        q.eq("userId", userId).eq("dbMediaId", mediaId)
      )
      .unique();

    // do nothing if give media is already logged
    if (existingLog) {
      // return message to display in sonner
      return "Already added";
    }

    // add log for media with status as planned
    await ctx.db.insert("logs", {
      dbMediaId: mediaId,
      status: "planned",
      userId,
    });

    // return message to display in sonner
    return "Added to planning";
  },
});

export const remove = mutation({
  args: {
    logId: v.id("logs"),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const existingLog = await ctx.db.get(args.logId);

    // check if log exists or belongs to logged-in user
    if (!existingLog || existingLog?.userId !== userId) {
      throw new Error("invalid request");
    }

    await ctx.db.delete(args.logId);
  },
});

export const updateStatus = mutation({
  args: {
    logId: v.id("logs"),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const existingLog = await ctx.db.get(args.logId);

    // check if user trying to delete the doc is the doc's owner
    if (!existingLog || existingLog?.userId !== userId) {
      throw new Error("invalid request");
    }

    await ctx.db.patch(args.logId, {
      status: args.status,
    });
  },
});

export const bulkUpdateStatus = mutation({
  args: {
    logIds: v.array(v.id("logs")),
    status: v.union(
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const logs = await Promise.all(args.logIds.map((id) => ctx.db.get(id)));

    // Verify all logs belong to the user
    for (const log of logs) {
      if (!log || log.userId !== userId) {
        throw new Error("invalid request");
      }
    }

    // Update all media logs in parallel
    await Promise.all(
      args.logIds.map((id) =>
        ctx.db.patch(id, {
          status: args.status,
        })
      )
    );
  },
});

export const bulkDelete = mutation({
  args: {
    logIds: v.array(v.id("logs")),
  },
  handler: async (ctx, args) => {
    const userId = await getCurrentUserOrThrow(ctx);

    const logs = await Promise.all(args.logIds.map((id) => ctx.db.get(id)));

    // Verify all media logs belong to the user
    for (const log of logs) {
      if (!log || log.userId !== userId) {
        throw new Error("invalid request");
      }
    }

    // Delete all media logs in parallel
    await Promise.all(args.logIds.map((id) => ctx.db.delete(id)));
  },
});
