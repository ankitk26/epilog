import { internalMutation } from "@convex/_generated/server";

export const migrateToLogs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const mediaLogs = await ctx.db.query("mediaLogs").collect();
    await Promise.all(
      mediaLogs.map((mediaLog) =>
        ctx.db.insert("logs", {
          dbMediaId: mediaLog.dbMediaId,
          status: mediaLog.status,
          userId: mediaLog.userId,
        })
      )
    );
  },
});
