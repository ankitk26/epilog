import { v } from "convex/values";
import { internalQuery } from "../_generated/server";

const mediaTypeLiteral = v.union(
	v.literal("anime"),
	v.literal("movie"),
	v.literal("tv"),
	v.literal("book"),
	v.literal("manga"),
);

export const getMediaWithoutCreator = internalQuery({
	args: {
		cursor: v.optional(v.id("media")),
		limit: v.number(),
		includeNull: v.optional(v.boolean()),
		fromScratch: v.optional(v.boolean()),
		type: v.optional(mediaTypeLiteral),
	},
	handler: async (ctx, args) => {
		let allMedia = await ctx.db.query("media").collect();

		if (args.type) {
			allMedia = allMedia.filter((media) => media.type === args.type);
		}

		const withoutCreator = args.fromScratch
			? allMedia
			: allMedia.filter((media) =>
					args.includeNull
						? media.creator == null
						: media.creator === undefined,
				);

		let startIndex = 0;
		if (args.cursor) {
			const idx = withoutCreator.findIndex(
				(media) => media._id === args.cursor,
			);
			startIndex = idx === -1 ? 0 : idx + 1;
		}

		const page = withoutCreator.slice(startIndex, startIndex + args.limit);

		return {
			media: page,
			nextCursor:
				page.length === args.limit ? page[page.length - 1]._id : null,
		};
	},
});

export const getOlMangaRecords = internalQuery({
	args: {
		limit: v.number(),
	},
	handler: async (ctx, args) => {
		const allMedia = await ctx.db.query("media").collect();
		const olManga = allMedia.filter(
			(media) =>
				media.type === "manga" &&
				media.sourceMediaId.startsWith("ol:manga:"),
		);
		return olManga.slice(0, args.limit);
	},
});
