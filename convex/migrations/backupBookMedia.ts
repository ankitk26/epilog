import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

// ─────────────────────────────────────────────
// Backup / restore helpers for book media covers.
// Run backupBookMedia before updateBookCovers.
// If something goes wrong, run restoreBookMedia.
// Run clearBookMediaBackup when you no longer need the backup.
// ─────────────────────────────────────────────

export const backupBookMedia = internalMutation({
	args: {},
	handler: async (ctx) => {
		const allMedia = await ctx.db.query("media").collect();
		const books = allMedia.filter((media) => media.type === "book");

		// Clear any existing backup first to avoid duplicates.
		const existingBackups = await ctx.db.query("mediaBackup").collect();
		for (const backup of existingBackups) {
			await ctx.db.delete(backup._id);
		}

		let backedUp = 0;
		for (const book of books) {
			await ctx.db.insert("mediaBackup", {
				originalId: book._id,
				name: book.name,
				image: book.image,
				releaseYear: book.releaseYear,
				creator: book.creator,
				sourceMediaId: book.sourceMediaId,
				type: "book",
				seriesName: book.seriesName,
				seriesPosition: book.seriesPosition,
				seriesTotal: book.seriesTotal,
				seriesKey: book.seriesKey,
			});
			backedUp++;
		}

		return { backedUp };
	},
});

export const restoreBookMedia = internalMutation({
	args: {},
	handler: async (ctx) => {
		const backups = await ctx.db.query("mediaBackup").collect();

		let restored = 0;
		let missing = 0;

		for (const backup of backups) {
			const media = await ctx.db.get(backup.originalId);
			if (!media) {
				missing++;
				continue;
			}

			await ctx.db.patch(backup.originalId, {
				name: backup.name,
				image: backup.image,
				releaseYear: backup.releaseYear,
				creator: backup.creator,
				sourceMediaId: backup.sourceMediaId,
				seriesName: backup.seriesName,
				seriesPosition: backup.seriesPosition,
				seriesTotal: backup.seriesTotal,
				seriesKey: backup.seriesKey,
			});
			restored++;
		}

		return { restored, missing };
	},
});

export const clearBookMediaBackup = internalMutation({
	args: {},
	handler: async (ctx) => {
		const backups = await ctx.db.query("mediaBackup").collect();

		let deleted = 0;
		for (const backup of backups) {
			await ctx.db.delete(backup._id);
			deleted++;
		}

		return { deleted };
	},
});
