import { internalMutation } from "../_generated/server";

// ─────────────────────────────────────────────
// Status migration: old 3-value enum → per-type statuses
// ─────────────────────────────────────────────

const oldToNewStatus: Record<string, Record<string, string>> = {
	book: { planned: "tbr", in_progress: "reading", completed: "finished" },
	manga: { planned: "tbr", in_progress: "reading", completed: "finished" },
	movie: {
		planned: "watchlist",
		in_progress: "watching",
		completed: "watched",
	},
	tv: {
		planned: "plan_to_watch",
		in_progress: "watching",
		completed: "completed",
	},
	anime: {
		planned: "plan_to_watch",
		in_progress: "watching",
		completed: "completed",
	},
};

export const migrateStatuses = internalMutation({
	args: {},
	handler: async (ctx) => {
		const allLogs = await ctx.db.query("logs").collect();

		let skipped = 0;
		let migrated = 0;
		const details: Array<{
			logId: string;
			old: string;
			new: string;
			type: string;
		}> = [];

		for (const log of allLogs) {
			const media = await ctx.db.get(log.dbMediaId);
			if (!media) {
				skipped++;
				continue;
			}

			const mapping = oldToNewStatus[media.type];
			if (!mapping) {
				skipped++;
				continue;
			}

			const newStatus = mapping[log.status];
			if (!newStatus) {
				// Already a new status or unknown old status
				skipped++;
				continue;
			}

			await ctx.db.patch(log._id, {
				status: newStatus as
					| "tbr"
					| "reading"
					| "finished"
					| "dnf"
					| "watchlist"
					| "watching"
					| "watched"
					| "plan_to_watch"
					| "waiting"
					| "completed"
					| "dropped",
			});
			migrated++;
			details.push({
				logId: log._id,
				old: log.status,
				new: newStatus,
				type: media.type,
			});
		}

		return { migrated, skipped, details };
	},
});
