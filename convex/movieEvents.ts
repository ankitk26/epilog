import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./model/users";

export const add = mutation({
	args: {
		media: v.object({
			name: v.string(),
			image: v.optional(v.union(v.string(), v.null())),
			releaseYear: v.union(v.number(), v.null()),
			sourceMediaId: v.string(),
		}),
		eventDate: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getCurrentUserOrThrow(ctx);
		const normalizedEventDate = args.eventDate.replaceAll("-", "");

		if (!/^\d{8}$/.test(normalizedEventDate)) {
			throw new Error("eventDate must be in YYYYMMDD format");
		}

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
				type: "movie",
			});
			mediaId = newMediaId;
		}

		const existingEvent = await ctx.db
			.query("movieEvents")
			.withIndex("by_user_and_mediaId_and_eventDate", (q) =>
				q
					.eq("userId", userId)
					.eq("dbMediaId", mediaId)
					.eq("eventDate", normalizedEventDate),
			)
			.unique();

		// do nothing if give movie is already entered
		if (existingEvent) {
			// return message to display in sonner
			return "Already added";
		}

		await ctx.db.insert("movieEvents", {
			userId,
			dbMediaId: mediaId,
			eventDate: normalizedEventDate,
		});

		return "Event added";
	},
});

export const getAll = query({
	handler: async (ctx) => {
		const userId = await getCurrentUserOrThrow(ctx);

		const movieEvents = await ctx.db
			.query("movieEvents")
			.withIndex("by_user_and_mediaId_and_eventDate", (q) =>
				q.eq("userId", userId),
			)
			.collect();

		const groupedByEventDate = new Map<
			string,
			Array<{
				_id: Id<"media">;
				_creationTime: number;
				name: string;
				image?: string | null;
				releaseYear: number | null;
				sourceMediaId: string;
				type: "anime" | "movie" | "tv" | "book";
				movieEventId: Id<"movieEvents">;
				eventDate: string;
			}>
		>();

		for (const movieEvent of movieEvents) {
			const media = await ctx.db.get(movieEvent.dbMediaId);

			if (!media) {
				continue;
			}

			const existingGroup =
				groupedByEventDate.get(movieEvent.eventDate) ?? [];

			existingGroup.push({
				...media,
				movieEventId: movieEvent._id,
				eventDate: movieEvent.eventDate,
			});

			groupedByEventDate.set(movieEvent.eventDate, existingGroup);
		}

		return Array.from(groupedByEventDate.entries()).map(
			([eventDate, movies]) => ({
				[eventDate]: movies,
			}),
		);
	},
});
