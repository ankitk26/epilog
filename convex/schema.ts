import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		email: v.string(),
		authId: v.string(),
		// Which media types the user tracks. When omitted, all types are shown.
		mediaTypes: v.optional(
			v.array(
				v.union(
					v.literal("anime"),
					v.literal("movie"),
					v.literal("tv"),
					v.literal("book"),
					v.literal("manga"),
				),
			),
		),
	}).index("by_auth_id", ["authId"]),

	media: defineTable({
		name: v.string(),
		image: v.optional(v.union(v.string(), v.null())),
		releaseYear: v.union(v.number(), v.null()),
		creator: v.optional(v.union(v.string(), v.null())),
		sourceMediaId: v.string(),
		type: v.union(
			v.literal("anime"),
			v.literal("movie"),
			v.literal("tv"),
			v.literal("book"),
			v.literal("manga"),
		),
		seriesName: v.optional(v.string()),
		seriesPosition: v.optional(v.number()),
		seriesTotal: v.optional(v.number()),
		seriesKey: v.optional(v.string()),
	}).index("by_sourceId", ["sourceMediaId"]),

	// Temporary backup of book media records before running cover-image migrations.
	mediaBackup: defineTable({
		originalId: v.id("media"),
		name: v.string(),
		image: v.optional(v.union(v.string(), v.null())),
		releaseYear: v.union(v.number(), v.null()),
		creator: v.optional(v.union(v.string(), v.null())),
		sourceMediaId: v.string(),
		type: v.literal("book"),
		seriesName: v.optional(v.string()),
		seriesPosition: v.optional(v.number()),
		seriesTotal: v.optional(v.number()),
		seriesKey: v.optional(v.string()),
	})
		.index("by_originalId", ["originalId"])
		.index("by_sourceId", ["sourceMediaId"]),

	// Logs track a user's relationship with a piece of media.
	// Status values are type-specific and validated at the API layer:
	//   book      : interested | tbr | reading | paused | finished | dnf
	//   manga     : tbr | reading | paused | finished | dnf
	//   movie      : watchlist | watching | paused | watched
	//   tv/anime   : plan_to_watch | watching | paused | waiting | completed | dropped
	logs: defineTable({
		userId: v.id("users"),
		dbMediaId: v.id("media"),
		status: v.union(
			// book
			v.literal("interested"),
			v.literal("tbr"),
			v.literal("reading"),
			v.literal("finished"),
			v.literal("dnf"),
			// manga
			// movie
			v.literal("watchlist"),
			v.literal("watching"),
			v.literal("watched"),
			// tv / anime
			v.literal("plan_to_watch"),
			v.literal("waiting"),
			v.literal("completed"),
			v.literal("dropped"),
			// shared
			v.literal("paused"),
		),
		updatedTime: v.number(),
		pageCount: v.optional(v.number()),
		pagesRead: v.optional(v.number()),
		// User-selected edition cover. Falls back to media.image when null.
		customImage: v.optional(v.union(v.string(), v.null())),
	})
		.index("by_media_and_status", ["dbMediaId", "status"])
		.index("by_user_and_mediaId", ["userId", "dbMediaId"])
		.index("by_user_and_updated_time", ["userId", "updatedTime"]),

	movieEvents: defineTable({
		userId: v.id("users"),
		dbMediaId: v.id("media"),
		eventDate: v.string(),
	}).index("by_user_and_mediaId_and_eventDate", [
		"userId",
		"dbMediaId",
		"eventDate",
	]),
});
