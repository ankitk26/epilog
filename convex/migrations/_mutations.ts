import { v } from "convex/values";
import { internalMutation } from "../_generated/server";
import { mergeMediaReferences } from "./_helpers";

export const updateMediaCreator = internalMutation({
	args: {
		mediaId: v.id("media"),
		creator: v.union(v.string(), v.null()),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.mediaId, { creator: args.creator });
	},
});

export const updateOlMangaToMal = internalMutation({
	args: {
		mediaId: v.id("media"),
		newSourceMediaId: v.string(),
		newName: v.string(),
		newImage: v.optional(v.union(v.string(), v.null())),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("media")
			.withIndex("by_sourceId", (q) =>
				q.eq("sourceMediaId", args.newSourceMediaId),
			)
			.first();

		if (existing && existing._id !== args.mediaId) {
			// A matching MAL manga already exists — merge references
			// into the canonical entry and delete the ol:manga row.
			await mergeMediaReferences(ctx, args.mediaId, existing._id);
			await ctx.db.delete(args.mediaId);
			return { action: "merged", canonicalId: existing._id };
		}

		await ctx.db.patch(args.mediaId, {
			sourceMediaId: args.newSourceMediaId,
			name: args.newName,
			image: args.newImage,
		});
		return { action: "patched" };
	},
});
