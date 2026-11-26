import { internalMutation } from "../_generated/server";
import { refreshMediaSnapshots } from "../lib/mediaSnapshots";

// ─────────────────────────────────────────────
// The series feature was removed: the media.seriesName / seriesPosition /
// seriesTotal / seriesKey fields are gone from the schema, so stored docs
// that still carry them fail schema validation on read. This migration
// clears those fields and strips series suffixes that OpenLibrary edition
// titles baked into stored names ("Golden Son (Red Rising, #2 of 3)" →
// "Golden Son"). Idempotent: clean docs are skipped. Run via
// `convex run migrations/removeMediaSeriesFields:removeMediaSeriesFields '{}'`
// (add `--prod` for production).
// ─────────────────────────────────────────────

// A trailing parenthetical that carries series info: "(Red Rising, #2 of 3)",
// "(The Red Rising Series, Book 1)", "(X Series)". Keep this in sync with
// stripSeriesInfo in apps/web/src/actions/search-open-library-books.ts.
const seriesSuffix =
	/\s*\((?:[^()]*\bseries\b[^()]*|[^()]*#\d+ of \d+[^()]*|[^()]*\bBook \d+\b[^()]*)\)\s*$/i;

function stripSeriesInfo(name: string): string {
	let out = name.trim();
	for (;;) {
		const next = out.replace(seriesSuffix, "").trim();
		if (next === "" || next === out) {
			return out;
		}
		out = next;
	}
}

export const removeMediaSeriesFields = internalMutation({
	handler: async (ctx) => {
		const media = await ctx.db.query("media").collect();

		let cleanedFields = 0;
		const renamed: Array<{ from: string; to: string }> = [];

		for (const doc of media) {
			const hasSeriesFields =
				"seriesName" in doc ||
				"seriesPosition" in doc ||
				"seriesTotal" in doc ||
				"seriesKey" in doc;
			const strippedName = stripSeriesInfo(doc.name);
			if (!hasSeriesFields && strippedName === doc.name) {
				continue;
			}

			// SAFETY: the generated media type no longer declares the series
			// fields, so the stored doc is read through an extended type to
			// drop them.
			const stored = doc as typeof doc & {
				seriesName?: string;
				seriesPosition?: number;
				seriesTotal?: number;
				seriesKey?: string;
			};
			const {
				seriesName: _seriesName,
				seriesPosition: _seriesPosition,
				seriesTotal: _seriesTotal,
				seriesKey: _seriesKey,
				...withoutSeries
			} = stored;

			const next = {
				...withoutSeries,
				name: strippedName,
			};

			await ctx.db.replace(doc._id, next);
			// The logs cache the media name in a denormalized snapshot; keep
			// them in sync with the renamed doc.
			if (strippedName !== doc.name) {
				renamed.push({ from: doc.name, to: strippedName });
				await refreshMediaSnapshots(ctx, next);
			}
			cleanedFields++;
		}

		return { cleanedFields, renamed };
	},
});
