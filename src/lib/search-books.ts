import { z } from "zod";

const openLibrarySearchOutput = z.object({
	numFound: z.number(),
	docs: z.array(
		z.object({
			key: z.string(),
			title: z.string(),
			author_name: z.array(z.string()).optional(),
			cover_i: z.number().optional(),
			first_publish_year: z.number().optional(),
			series_key: z.array(z.string()).optional(),
			series_name: z.array(z.string()).optional(),
			series_position: z.array(z.string()).optional(),
			editions: z
				.object({
					docs: z.array(
						z.object({
							cover_i: z.number().optional(),
							language: z.array(z.string()).optional(),
						}),
					),
				})
				.optional(),
		}),
	),
});

export type BookSearchResult = {
	id: string;
	title: string;
	author: string | null;
	imageUrl: string | null;
	publishYear: number | null;
	seriesName: string | null;
	seriesPosition: number | null;
	seriesTotal: number | null;
	seriesKey: string | null;
};

export async function searchBooks(query: string): Promise<BookSearchResult[]> {
	if (!query.trim()) return [];

	const url = new URL("https://openlibrary.org/search.json");
	url.searchParams.set("q", `${query} language:eng`);
	url.searchParams.set("lang", "en");
	url.searchParams.set("limit", "20");
	url.searchParams.set(
		"fields",
		"key,title,author_name,cover_i,first_publish_year,series_key,series_name,series_position,editions",
	);

	const res = await fetch(url.toString());
	if (!res.ok) throw new Error(`OpenLibrary error: ${res.status}`);

	const json = await res.json();
	const parsed = openLibrarySearchOutput.parse(json);

	const collectionPatterns =
		/\b(box\s*set|collection|omnibus|volumes?|books?\s+1[-–]|complete\s+series|the\s+\d+\s+books)\b/i;

	const individualBooks = parsed.docs.filter((book) => {
		const position = book.series_position?.[0] ?? "";
		const looksLikeCollection =
			collectionPatterns.test(book.title) ||
			/^\d+[-–]\d+$/.test(position);
		return !looksLikeCollection;
	});

	return individualBooks.map((book) => {
		const englishEdition = book.editions?.docs.find(
			(ed) => ed.language?.includes("eng") && ed.cover_i,
		);
		const coverId = englishEdition?.cover_i ?? book.cover_i;
		const imageUrl = coverId
			? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
			: null;

		const seriesKey = book.series_key?.[0] ?? null;
		const seriesName = book.series_name?.[0] ?? null;
		const positionStr = book.series_position?.[0];
		const seriesPosition =
			positionStr && /^\d+$/.test(positionStr)
				? parseInt(positionStr, 10)
				: null;

		return {
			id: book.key,
			title: book.title,
			author: book.author_name?.[0] ?? null,
			imageUrl,
			publishYear: book.first_publish_year ?? null,
			seriesName,
			seriesPosition,
			seriesTotal: null,
			seriesKey,
		};
	});
}
