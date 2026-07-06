import { internalMutation } from "../_generated/server";

// ─────────────────────────────────────────────
// Remove media rows that are not referenced by
// any log or movie event.
// ─────────────────────────────────────────────

export const removeUnusedMedia = internalMutation({
	args: {},
	handler: async (ctx) => {
		const allMedia = await ctx.db.query("media").collect();
		const allLogs = await ctx.db.query("logs").collect();
		const allEvents = await ctx.db.query("movieEvents").collect();

		const usedMediaIds = new Set([
			...allLogs.map((log) => log.dbMediaId),
			...allEvents.map((event) => event.dbMediaId),
		]);

		const removed: Array<{
			_id: string;
			name: string;
			sourceMediaId: string;
		}> = [];

		for (const media of allMedia) {
			if (usedMediaIds.has(media._id)) {
				continue;
			}

			await ctx.db.delete(media._id);
			removed.push({
				_id: media._id,
				name: media.name,
				sourceMediaId: media.sourceMediaId,
			});
		}

		return {
			removedCount: removed.length,
			remainingCount: allMedia.length - removed.length,
			removed,
		};
	},
});
