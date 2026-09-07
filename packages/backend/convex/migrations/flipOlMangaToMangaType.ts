import { internalMutation } from "../_generated/server";

// ─────────────────────────────────────────────
// Flip purely numeric ol:book IDs that were
// actually manga to type "manga".
// ─────────────────────────────────────────────

export const flipOlMangaToMangaType = internalMutation({
	args: {},
	handler: async (ctx) => {
		const allMedia = await ctx.db.query("media").collect();

		const flipped: Array<{ name: string; oldId: string; newId: string }> =
			[];
		const kept: Array<{ name: string; reason: string }> = [];

		for (const doc of allMedia) {
			if (doc.type !== "book") continue;
			if (!doc.sourceMediaId.startsWith("ol:book:")) continue;

			// Idempotency: already flipped.
			if (doc.sourceMediaId.startsWith("ol:manga:")) continue;

			const olId = doc.sourceMediaId.slice("ol:book:".length);

			// Real OpenLibrary books have /works/ in their work key.
			if (olId.includes("/works/")) {
				kept.push({ name: doc.name, reason: "has /works/" });
				continue;
			}

			// Manga IDs added via OpenLibrary are purely numeric.
			// Non-numeric IDs (e.g. wrOQLV6xB-wC, OL26594474M) are books.
			if (!/^\d+$/.test(olId)) {
				kept.push({ name: doc.name, reason: "non-numeric id" });
				continue;
			}

			// Purely numeric ol:book: id -> manga.
			const newSourceMediaId = `ol:manga:${olId}`;
			await ctx.db.patch(doc._id, {
				type: "manga",
				sourceMediaId: newSourceMediaId,
			});
			flipped.push({
				name: doc.name,
				oldId: doc.sourceMediaId,
				newId: newSourceMediaId,
			});
		}

		return {
			flippedCount: flipped.length,
			keptCount: kept.length,
			flipped,
			kept,
		};
	},
});
