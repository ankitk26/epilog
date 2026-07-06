import { internalMutation } from "../_generated/server";
import { mergeMediaReferences } from "./_helpers";

// ─────────────────────────────────────────────
// Normalize ol:book source IDs from /works/OL…W
// to OL…W (no /works/ prefix).
// ─────────────────────────────────────────────

export const normalizeOlBookSourceIds = internalMutation({
	args: {},
	handler: async (ctx) => {
		const allMedia = await ctx.db.query("media").collect();
		const normalized: Array<{
			_id: string;
			name: string;
			oldId: string;
			newId: string;
			action: string;
		}> = [];

		for (const media of allMedia) {
			if (
				media.type !== "book" ||
				!media.sourceMediaId.startsWith("ol:book:/works/")
			) {
				continue;
			}

			const olId = media.sourceMediaId.slice("ol:book:/works/".length);
			const newSourceMediaId = `ol:book:${olId}`;

			const existing = await ctx.db
				.query("media")
				.withIndex("by_sourceId", (q) =>
					q.eq("sourceMediaId", newSourceMediaId),
				)
				.first();

			if (existing && existing._id !== media._id) {
				await mergeMediaReferences(ctx, media._id, existing._id);
				await ctx.db.delete(media._id);
				normalized.push({
					_id: media._id,
					name: media.name,
					oldId: media.sourceMediaId,
					newId: newSourceMediaId,
					action: "merged",
				});
			} else {
				await ctx.db.patch(media._id, {
					sourceMediaId: newSourceMediaId,
				});
				normalized.push({
					_id: media._id,
					name: media.name,
					oldId: media.sourceMediaId,
					newId: newSourceMediaId,
					action: "patched",
				});
			}
		}

		return {
			normalizedCount: normalized.length,
			normalized,
		};
	},
});
