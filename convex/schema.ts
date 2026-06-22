import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	users: defineTable({
		email: v.string(),
		authId: v.string(),
	}).index("by_auth_id", ["authId"]),

	media: defineTable({
		name: v.string(),
		image: v.optional(v.union(v.string(), v.null())),
		releaseYear: v.union(v.number(), v.null()),
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

	// Logs track a user's relationship with a piece of media.
	// Status values are type-specific and validated at the API layer:
	//   book/manga : tbr | reading | finished | dnf
	//   movie      : watchlist | watching | watched
	//   tv/anime   : plan_to_watch | watching | waiting | completed | dropped
	logs: defineTable({
		userId: v.id("users"),
		dbMediaId: v.id("media"),
		status: v.union(
			// book / manga
			v.literal("tbr"),
			v.literal("reading"),
			v.literal("finished"),
			v.literal("dnf"),
			// movie
			v.literal("watchlist"),
			v.literal("watching"),
			v.literal("watched"),
			// tv / anime
			v.literal("plan_to_watch"),
			v.literal("waiting"),
			v.literal("completed"),
			v.literal("dropped"),
		),
		updatedTime: v.number(),
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
