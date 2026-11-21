import { internalMutation } from "../_generated/server";

// ─────────────────────────────────────────────
// The rating feature was removed: the logs.rating field is gone from the
// schema, so stored docs that still carry it fail schema validation on
// read. Clears the field from every log. Idempotent: logs without a
// rating are skipped. Run via
// `convex run migrations/removeLogRatings:removeLogRatings '{}'`.
// ─────────────────────────────────────────────

export const removeLogRatings = internalMutation({
	handler: async (ctx) => {
		const logs = await ctx.db.query("logs").collect();

		let removed = 0;

		for (const log of logs) {
			if (!("rating" in log)) continue;

			// SAFETY: the generated log type no longer declares `rating`, so the
			// stored doc is read through an extended type to drop the field.
			const doc = log as typeof log & { rating?: number };
			const { rating: _rating, ...withoutRating } = doc;

			await ctx.db.replace(log._id, withoutRating);
			removed++;
		}

		return { removed };
	},
});
