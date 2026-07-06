import { standardizePersonName } from "../../src/lib/standardize-person-name";
import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export function getRequestDelayMs(sourceMediaId: string): number {
	const [source] = sourceMediaId.split(":");

	switch (source) {
		case "mal":
			// Jikan: 3 requests/sec, 60 requests/min.
			// 1200 ms keeps us well under both limits.
			return 1200;
		case "tmdb":
			// TMDB free tier: ~40 requests / 10 sec.
			// 350 ms ≈ 2.9 requests/sec.
			return 350;
		case "ol":
			// OpenLibrary is lenient, but each book needs two round-trips
			// (work + author). 600 ms is conservative.
			return 600;
		default:
			return 500;
	}
}

export async function mergeMediaReferences(
	ctx: MutationCtx,
	fromMediaId: Id<"media">,
	toMediaId: Id<"media">,
) {
	// Repoint logs. If the canonical media already has a log for the same user,
	// drop the duplicate log to respect the one-log-per-user invariant.
	const duplicateLogs = await ctx.db
		.query("logs")
		.withIndex("by_media_and_status", (q) => q.eq("dbMediaId", fromMediaId))
		.collect();

	for (const log of duplicateLogs) {
		const existingCanonicalLog = await ctx.db
			.query("logs")
			.withIndex("by_user_and_mediaId", (q) =>
				q.eq("userId", log.userId).eq("dbMediaId", toMediaId),
			)
			.unique();

		if (existingCanonicalLog) {
			await ctx.db.delete(log._id);
		} else {
			await ctx.db.patch(log._id, { dbMediaId: toMediaId });
		}
	}

	// Repoint movieEvents. No index starts with dbMediaId, so a full scan
	// + in-memory filter is the only option (fine for a one-time migration
	// on a small table). If canonical already has an event for the same
	// user + date, drop the duplicate to respect the unique index.
	const allEvents = await ctx.db.query("movieEvents").collect();
	const duplicateEvents = allEvents.filter(
		(event) => event.dbMediaId === fromMediaId,
	);

	for (const event of duplicateEvents) {
		const existingCanonicalEvent = await ctx.db
			.query("movieEvents")
			.withIndex("by_user_and_mediaId_and_eventDate", (q) =>
				q
					.eq("userId", event.userId)
					.eq("dbMediaId", toMediaId)
					.eq("eventDate", event.eventDate),
			)
			.unique();

		if (existingCanonicalEvent) {
			await ctx.db.delete(event._id);
		} else {
			await ctx.db.patch(event._id, { dbMediaId: toMediaId });
		}
	}
}

export async function fetchCreatorForMedia(
	media: Doc<"media">,
): Promise<string | null | undefined> {
	const [source, mediaType, ...rest] = media.sourceMediaId.split(":");
	const nativeId = rest.join(":");

	if (!source || !mediaType || !nativeId) {
		return undefined;
	}

	switch (source) {
		case "tmdb":
			return fetchTmdbCreator(nativeId, mediaType as "movie" | "tv");
		case "mal":
			return fetchJikanCreator(nativeId, mediaType as "anime" | "manga");
		case "ol":
			// Manga should be resolved via Jikan (mal: source).
			// Only use OpenLibrary for books.
			if (mediaType === "manga") {
				return undefined;
			}
			return fetchOpenLibraryCreator(nativeId, mediaType as "book");
		default:
			return undefined;
	}
}

async function fetchTmdbCreator(
	tmdbId: string,
	mediaType: "movie" | "tv",
): Promise<string | null> {
	const token = process.env.TMDB_TOKEN;
	if (!token) {
		throw new Error("TMDB_TOKEN is not configured");
	}

	const headers = { authorization: `Bearer ${token}` };

	if (mediaType === "movie") {
		const response = await fetch(
			`https://api.themoviedb.org/3/movie/${tmdbId}/credits`,
			{ headers },
		);
		if (!response.ok) {
			throw new Error(`TMDB movie credits returned ${response.status}`);
		}
		const data = (await response.json()) as {
			crew?: Array<{ job: string; name: string }>;
		};
		const director = data.crew?.find((person) => person.job === "Director");
		return director?.name ?? null;
	}

	const response = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}`, {
		headers,
	});
	if (!response.ok) {
		throw new Error(`TMDB TV details returned ${response.status}`);
	}
	const data = (await response.json()) as {
		created_by?: Array<{ name: string }>;
		networks?: Array<{ name: string }>;
	};

	return data.networks?.[0]?.name ?? data.created_by?.[0]?.name ?? null;
}

async function fetchJikanCreator(
	malId: string,
	mediaType: "anime" | "manga",
): Promise<string | null> {
	const response = await fetch(
		`https://api.jikan.moe/v4/${mediaType}/${malId}`,
	);

	// Jikan is rate-limited to ~3 requests/second.
	await new Promise((resolve) => setTimeout(resolve, 400));

	if (!response.ok) {
		throw new Error(
			`Jikan ${mediaType} details returned ${response.status}`,
		);
	}

	const data = (await response.json()) as {
		data?: {
			authors?: Array<{ name: string }>;
			studios?: Array<{ name: string }>;
		};
	};

	if (mediaType === "anime") {
		return data.data?.studios?.[0]?.name ?? null;
	}

	return standardizePersonName(data.data?.authors?.[0]?.name);
}

async function fetchOpenLibraryCreator(
	openLibraryId: string,
	_mediaType: "book" | "manga",
): Promise<string | null> {
	let workData: unknown;

	if (openLibraryId.startsWith("/works/")) {
		const response = await fetch(
			`https://openlibrary.org${openLibraryId}.json`,
		);
		if (!response.ok) {
			throw new Error(`OpenLibrary work returned ${response.status}`);
		}
		workData = await response.json();
	} else if (openLibraryId.startsWith("/books/")) {
		const response = await fetch(
			`https://openlibrary.org${openLibraryId}.json`,
		);
		if (!response.ok) {
			throw new Error(`OpenLibrary edition returned ${response.status}`);
		}
		const edition = (await response.json()) as {
			works?: Array<{ key: string }>;
		};
		const workKey = edition.works?.[0]?.key;
		if (!workKey) return null;
		const workResponse = await fetch(
			`https://openlibrary.org${workKey}.json`,
		);
		if (!workResponse.ok) {
			throw new Error(`OpenLibrary work returned ${workResponse.status}`);
		}
		workData = await workResponse.json();
	} else if (/^OL\d+W$/.test(openLibraryId)) {
		const response = await fetch(
			`https://openlibrary.org/works/${openLibraryId}.json`,
		);
		if (!response.ok) {
			throw new Error(`OpenLibrary work returned ${response.status}`);
		}
		workData = await response.json();
	} else if (/^OL\d+M$/.test(openLibraryId)) {
		const response = await fetch(
			`https://openlibrary.org/books/${openLibraryId}.json`,
		);
		if (!response.ok) {
			throw new Error(`OpenLibrary edition returned ${response.status}`);
		}
		const edition = (await response.json()) as {
			works?: Array<{ key: string }>;
		};
		const workKey = edition.works?.[0]?.key;
		if (!workKey) return null;
		const workResponse = await fetch(
			`https://openlibrary.org${workKey}.json`,
		);
		if (!workResponse.ok) {
			throw new Error(`OpenLibrary work returned ${workResponse.status}`);
		}
		workData = await workResponse.json();
	} else {
		// Plain IDs like Google Books IDs (e.g. wrOQLV6xB-wC) may map to
		// /books/{id} or be stale. Try books first, then works, and treat
		// a 404 as "no creator available" instead of failing the batch.
		let response = await fetch(
			`https://openlibrary.org/books/${openLibraryId}.json`,
		);

		if (response.ok) {
			const edition = (await response.json()) as {
				works?: Array<{ key: string }>;
			};
			const workKey = edition.works?.[0]?.key;
			if (workKey) {
				response = await fetch(
					`https://openlibrary.org${workKey}.json`,
				);
			}
		} else if (response.status === 404) {
			response = await fetch(
				`https://openlibrary.org/works/${openLibraryId}.json`,
			);
		}

		if (!response.ok) {
			if (response.status === 404) {
				console.log(
					`  OpenLibrary id ${openLibraryId} not found (404)`,
				);
				return null;
			}
			throw new Error(`OpenLibrary lookup returned ${response.status}`);
		}

		workData = await response.json();
	}

	if (!workData) return null;

	const work = workData as {
		authors?: Array<{ author?: { key: string } }>;
	};
	const authorKey = work.authors?.[0]?.author?.key;
	if (!authorKey) return null;

	const authorResponse = await fetch(
		`https://openlibrary.org${authorKey}.json`,
	);
	if (!authorResponse.ok) {
		throw new Error(`OpenLibrary author returned ${authorResponse.status}`);
	}
	const author = (await authorResponse.json()) as { name?: string };
	return author.name ?? null;
}
