import { query } from "./_generated/server";

export const all = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const mediaLogs = await ctx.db
      .query("mediaLogs")
      .withIndex("user", (q) => q.eq("userId", identity.subject))
      .collect();

    const fullMediaLogs = await Promise.all(
      mediaLogs.map(async (log) => {
        const media = await ctx.db.get(log.dbMediaId);
        return { ...log, metadata: media };
      })
    );

    return fullMediaLogs;
  },
});
