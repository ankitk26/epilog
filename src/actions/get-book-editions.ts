import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import {
	type BookEditionOutput,
	openLibraryWorkEditionsAPIOutput,
} from "@/types";

const EDITIONS_TIMEOUT_MS = 10_000;

type WorkEditionEntry = {
	key?: string;
	title?: string | null;
	covers?: number[];
	languages?: Array<string | { key: string }>;
	publication_date?: string | null;
};

export type BookEditionCover = {
	id: string;
	title: string | null;
	publicationDate: string | null;
	coverUrl: string | null;
};

function getEditionCoverUrl(entry: WorkEditionEntry): string | null {
	const coverId = entry.covers?.find((cover) => cover > 0);

	return coverId
		? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
		: null;
}

export const getBookEditionCovers = createServerFn({ method: "GET" })
	.inputValidator((data: { workId: string }) => data)
	.handler(async ({ data }): Promise<BookEditionCover[]> => {
		const { data: editions, error } = await betterFetch(
			`https://openlibrary.org/works/${data.workId}/editions.json`,
			{
				method: "GET",
				signal: AbortSignal.timeout(EDITIONS_TIMEOUT_MS),
				output: openLibraryWorkEditionsAPIOutput,
			},
		);

		if (error || !editions) {
			console.error("OpenLibrary editions API error:", error);
			throw new Error("Open Library editions are unavailable");
		}

		// SAFETY: response shape is validated by openLibraryWorkEditionsAPIOutput.
		const allEditions = (editions as BookEditionOutput).entries;

		return allEditions
			.map((entry, index) => ({
				id: entry.key ?? `edition-${index}`,
				title: entry.title ?? null,
				publicationDate: entry.publication_date ?? null,
				coverUrl: getEditionCoverUrl(entry),
			}))
			.filter((edition) => edition.coverUrl !== null);
	});
