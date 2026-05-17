import { mutation } from "./_generated/server";

export const backfillLogUpdatedTime = mutation({
	args: {},
	handler: async (ctx) => {
		const logs = await ctx.db.query("logs").collect();
		const logsMissingUpdatedTime = logs.filter(
			(log) => log.updatedTime === undefined,
		);

		await Promise.all(
			logsMissingUpdatedTime.map((log) =>
				ctx.db.patch(log._id, {
					updatedTime: log._creationTime,
				}),
			),
		);

		return {
			updated: logsMissingUpdatedTime.length,
		};
	},
});
