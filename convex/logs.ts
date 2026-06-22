import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./model/users";

const allStatusLiterals = v.union(
	v.literal("tbr"),
	v.literal("reading"),
	v.literal("finished"),
	v.literal("dnf"),
	v.literal("watchlist"),
	v.literal("watching"),
	v.literal("watched"),
	v.literal("plan_to_watch"),
	v.literal("waiting"),
	v.literal("completed"),
	v.literal("dropped"),
	// legacy values — keep until production migration completes
	v.literal("planned"),
	v.literal("in_progress"),
);

const mediaTypeLiteral = v.union(
	v.literal("anime"),
	v.literal("movie"),
	v.literal("tv"),
	v.literal("book"),
	v.literal("manga"),
);

function defaultStatusForType(
	type: "anime" | "movie" | "tv" | "book" | "manga",
): string {
	switch (type) {
		case "book":
		case "manga":
			return "tbr";
		case "movie":
			return "watchlist";
		case "tv":
		case "anime":
			return "plan_to_watch";
	}
}

const validStatusesByType: Record<
	"anime" | "movie" | "tv" | "book" | "manga",
	Set<string>
> = {
	book: new Set(["tbr", "reading", "finished", "dnf"]),
	manga: new Set(["tbr", "reading", "finished", "dnf"]),
	movie: new Set(["watchlist", "watching", "watched"]),
	tv: new Set([
		"plan_to_watch",
		"watching",
		"waiting",
		"completed",
		"dropped",
	]),
	anime: new Set([
		"plan_to_watch",
		"watching",
		"waiting",
		"completed",
		"dropped",
	]),
};

export const all = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getCurrentUserOrThrow(ctx);

		const logs = await ctx.db
			.query("logs")
			.withIndex("by_user_and_updated_time", (q) =>
				q.eq("userId", userId),
			)
			.order("desc")
			.collect();

		const rawLogs = await Promise.all(
			logs.map(async (log) => {
				const media = await ctx.db.get(log.dbMediaId);
				return { ...log, metadata: media };
			}),
		);

		const finalLogs = rawLogs
			.filter((log) => log.metadata !== null)
			.map((log) => ({
				...log,
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
			type: mediaTypeLiteral,
			seriesName: v.optional(v.string()),
			seriesPosition: v.optional(v.number()),
			seriesTotal: v.optional(v.number()),
			seriesKey: v.optional(v.string()),
		}),
	},
	handler: async (ctx, args) => {
		const userId = await getCurrentUserOrThrow(ctx);

		let mediaId: Id<"media">;

		// check if media entry exists
		const existingMedia = await ctx.db
			.query("media")
			.withIndex("by_sourceId", (q) =>
				q.eq("sourceMediaId", args.media.sourceMediaId),
			)
			.first();

		if (existingMedia) {
			// assign alredy existing id to mediaId
			mediaId = existingMedia._id;
		} else {
			// create new media entry and get its ID
			const newMediaId = await ctx.db.insert("media", {
				image: args.media.image,
				name: args.media.name,
				releaseYear: args.media.releaseYear,
				sourceMediaId: args.media.sourceMediaId,
				type: args.media.type,
				seriesName: args.media.seriesName,
				seriesPosition: args.media.seriesPosition,
				seriesTotal: args.media.seriesTotal,
				seriesKey: args.media.seriesKey,
			});
			mediaId = newMediaId;
		}

		// check if media is already logged by current user
		const existingLog = await ctx.db
			.query("logs")
			.withIndex("by_user_and_mediaId", (q) =>
				q.eq("userId", userId).eq("dbMediaId", mediaId),
			)
			.unique();

		// do nothing if give media is already logged
		if (existingLog) {
			// return message to display in sonner
			return "Already added";
		}

		// add log for media with type-specific default status
		await ctx.db.insert("logs", {
			dbMediaId: mediaId,
			status: defaultStatusForType(args.media.type) as
				| "tbr"
				| "reading"
				| "finished"
				| "dnf"
				| "watchlist"
				| "watching"
				| "watched"
				| "plan_to_watch"
				| "waiting"
				| "completed"
				| "dropped",
			updatedTime: Date.now(),
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
		status: allStatusLiterals,
	},
	handler: async (ctx, args) => {
		const userId = await getCurrentUserOrThrow(ctx);

		const existingLog = await ctx.db.get(args.logId);

		// check if user trying to delete the doc is the doc's owner
		if (!existingLog || existingLog?.userId !== userId) {
			throw new Error("invalid request");
		}

		const media = await ctx.db.get(existingLog.dbMediaId);
		if (!media) {
			throw new Error("media not found");
		}

		const valid = validStatusesByType[media.type];
		if (!valid.has(args.status)) {
			throw new Error(
				`invalid status "${args.status}" for media type "${media.type}"`,
			);
		}

		await ctx.db.patch(args.logId, {
			status: args.status,
			updatedTime: Date.now(),
		});
	},
});

export const update = mutation({
	args: {
		logId: v.id("logs"),
		status: allStatusLiterals,
	},
	handler: async (ctx, args) => {
		const userId = await getCurrentUserOrThrow(ctx);

		const existingLog = await ctx.db.get(args.logId);

		if (!existingLog || existingLog.userId !== userId) {
			throw new Error("invalid request");
		}

		const media = await ctx.db.get(existingLog.dbMediaId);
		if (!media) {
			throw new Error("media not found");
		}

		const valid = validStatusesByType[media.type];
		if (!valid.has(args.status)) {
			throw new Error(
				`invalid status "${args.status}" for media type "${media.type}"`,
			);
		}

		await ctx.db.patch(args.logId, {
			status: args.status,
			updatedTime: Date.now(),
		});
	},
});

export const bulkUpdateStatus = mutation({
	args: {
		logIds: v.array(v.id("logs")),
		status: allStatusLiterals,
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

		// Verify status is valid for each log's media type
		for (const log of logs) {
			if (!log) continue;
			const media = await ctx.db.get(log.dbMediaId);
			if (!media) {
				throw new Error("media not found");
			}
			const valid = validStatusesByType[media.type];
			if (!valid.has(args.status)) {
				throw new Error(
					`invalid status "${args.status}" for media type "${media.type}"`,
				);
			}
		}

		const updatedTime = Date.now();

		// Update all media logs
		await Promise.all(
			args.logIds.map((id) =>
				ctx.db.patch(id, {
					status: args.status,
					updatedTime,
				}),
			),
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

		// Delete all media logs
		await Promise.all(args.logIds.map((id) => ctx.db.delete(id)));
	},
});
