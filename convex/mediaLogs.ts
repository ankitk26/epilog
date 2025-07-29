import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

export const all = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const mediaLogs = await ctx.db
      .query("mediaLogs")
      .withIndex("user_and_media", (q) => q.eq("userId", identity.subject))
      .collect();

    const rawMediaLogs = await Promise.all(
      mediaLogs.map(async (log) => {
        const media = await ctx.db.get(log.dbMediaId);
        return { ...log, metadata: media };
      })
    );

    const fullMediaLogs = rawMediaLogs
      .filter((log) => log.metadata !== null)
      .map((log) => ({ ...log, metadata: log.metadata! }));

    return fullMediaLogs;
  },
});

export const addToPlanning = mutation({
  args: {
    media: v.object({
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
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

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
      console.log("Media already exists => ", mediaId);
    } else {
      // create new media row and get its ID
      const newMediaId = await ctx.db.insert("media", {
        image: args.media.image,
        name: args.media.name,
        releaseYear: args.media.releaseYear,
        sourceMediaId: args.media.sourceMediaId,
        type: args.media.type,
      });
      console.log("Media created => ", newMediaId);
      mediaId = newMediaId;
    }

    // check if media is already logged
    const mediaLogCheck = await ctx.db
      .query("mediaLogs")
      .withIndex("user_and_media", (q) =>
        q.eq("userId", identity.subject).eq("dbMediaId", mediaId)
      )
      .collect();

    // do nothing if everything already exists
    if (mediaLogCheck.length > 0) {
      console.log("Already exists");
      return;
    }

    console.log("Inserting new log");

    await ctx.db.insert("mediaLogs", {
      dbMediaId: mediaId,
      status: "planned",
      userId: identity.subject,
    });
  },
});

export const remove = mutation({
  args: {
    mediaLogId: v.id("mediaLogs"),
  },
  handler: async (ctx, args) => {
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
    await ctx.db.patch(args.mediaLogId, {
      status: args.status,
    });
  },
});
