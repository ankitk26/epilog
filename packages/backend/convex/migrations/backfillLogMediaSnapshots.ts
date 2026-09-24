import { internalMutation } from "../_generated/server";
import { mediaSnapshotFields } from "../lib/mediaSnapshots";

// ─────────────────────────────────────────────
// Copies each log's media display fields (name, image,
// releaseYear, creator, type, sourceMediaId) onto the log
// itself so logs.all can serve the library view without a
// per-log media join. Idempotent: runs automatically after
// `pnpm deploy:convex` and no-ops once every log has a
// snapshot.
// ─────────────────────────────────────────────

export const backfillLogMediaSnapshots = internalMutation({
	args: {},
	handler: async (ctx) => {
		const logs = await ctx.db.query("logs").collect();

		let patched = 0;
		let orphaned = 0;

		for (const log of logs) {
			if (log.mediaType !== undefined) {
				continue; // already backfilled
			}

			const media = await ctx.db.get(log.dbMediaId);
			if (!media) {
				orphaned++;
				continue;
			}

			await ctx.db.patch(log._id, mediaSnapshotFields(media));
			patched++;
		}

		console.log(
			`[backfillLogMediaSnapshots] patched=${patched} orphaned=${orphaned}`,
		);

		return { patched, orphaned };
	},
});
