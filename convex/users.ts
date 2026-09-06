import { v } from "convex/values";
import { mediaTypes } from "../src/lib/media-statuses";
import type { MediaType } from "../src/lib/media-statuses";
import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./model/users";

const mediaTypeValue = v.union(
	v.literal("anime"),
	v.literal("movie"),
	v.literal("tv"),
	v.literal("book"),
	v.literal("manga"),
);

// Current user's profile. mediaTypes falls back to all types when the user
// has never customized their preferences.
export const me = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getCurrentUserOrThrow(ctx);

		const user = await ctx.db.get(userId);
		if (!user) {
			throw new Error("Unauthorized");
		}

		const enabled: MediaType[] = user.mediaTypes
			? mediaTypes.filter((type) => user.mediaTypes?.includes(type))
			: [...mediaTypes];

		return {
			email: user.email,
			mediaTypes: enabled,
		};
	},
});

export const updateMediaTypes = mutation({
	args: {
		mediaTypes: v.array(mediaTypeValue),
	},
	handler: async (ctx, args) => {
		const userId = await getCurrentUserOrThrow(ctx);

		if (args.mediaTypes.length === 0) {
			throw new Error("at least one media type must be enabled");
		}

		// Dedupe while preserving the canonical media type order.
		const nextMediaTypes = mediaTypes.filter((type) =>
			args.mediaTypes.includes(type),
		);

		await ctx.db.patch(userId, { mediaTypes: nextMediaTypes });
	},
});
