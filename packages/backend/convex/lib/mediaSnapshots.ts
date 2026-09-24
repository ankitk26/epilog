import type { Doc } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

// Denormalized media snapshot fields stored on each log doc. Logs cache
// these so library queries (logs.all) don't need a per-log media join.
export const mediaSnapshotFields = (media: Doc<"media">) => ({
	mediaName: media.name,
	mediaImage: media.image,
	mediaReleaseYear: media.releaseYear,
	mediaCreator: media.creator,
	mediaType: media.type,
	mediaSourceMediaId: media.sourceMediaId,
});

/**
 * Keeps logs' denormalized media snapshots in sync after a media doc's
 * display fields change (title, author, cover, source id, …). Call this
 * from every write path that patches a `media` document's fields.
 */
export async function refreshMediaSnapshots(
	ctx: MutationCtx,
	media: Doc<"media">,
) {
	const logs = await ctx.db
		.query("logs")
		.withIndex("by_media_and_status", (q) => q.eq("dbMediaId", media._id))
		.collect();

	const fields = mediaSnapshotFields(media);
	await Promise.all(logs.map((log) => ctx.db.patch(log._id, fields)));
}
