import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import { providerFetch, runProvider } from "@/lib/provider-fetch";
import {
	openLibraryBookSearchAPIOutput,
	searchMediaAPIOutput,
	searchMediaListAPIOutput,
} from "@/types";

const SEARCH_LIMIT = 20;
const SEARCH_TIMEOUT_MS = 10_000;

const collectionPatterns =
	/\b(box\s*set|collection|omnibus|volumes?|books?\s+1[-–]|complete\s+series|the\s+\d+\s+books)\b/i;

const latinTextPattern = /\p{Script=Latin}/u;

const openLibrarySearchFields = [
	"key",
	"title",
	"author_name",
	"author_alternative_name",
	"cover_i",
	"first_publish_year",
	"editions",
	"editions.title",
	"editions.cover_i",
	"editions.language",
];

type OpenLibraryBookDoc = {
	key: string;
	title: string;
	author_name?: string[];
	author_alternative_name?: string[];
	cover_i?: number;
	first_publish_year?: number;
	editions?: {
		docs: Array<{
			title?: string;
			cover_i?: number;
			language?: string[];
		}>;
	};
};

function getAuthorName(book: {
	author_alternative_name?: string[];
	author_name?: string[];
}) {
	const primaryName = book.author_name?.[0];

	if (primaryName && latinTextPattern.test(primaryName)) {
		return primaryName;
	}

	const latinAlternatives =
		book.author_alternative_name?.filter((name) =>
			latinTextPattern.test(name),
		) ?? [];

	// Prefer the natural "FirstName LastName" format (no comma) over
	// the inverted "LastName, FirstName" format that OpenLibrary returns.
	const naturalName = latinAlternatives.find((name) => !name.includes(","));
	if (naturalName) {
		return naturalName;
	}

	// Fall back to first Latin alternative even if comma-formatted.
	if (latinAlternatives.length > 0) {
		return latinAlternatives[0];
	}

	return primaryName ?? null;
}

function looksLikeCollection(book: OpenLibraryBookDoc) {
	return collectionPatterns.test(book.title);
}

function isEnglishEdition(edition: { language?: string[] }) {
	return (
		edition.language?.some((language) => {
			const normalizedLanguage = language.toLowerCase();
			return (
				normalizedLanguage === "en" ||
				normalizedLanguage === "eng" ||
				normalizedLanguage.endsWith("/eng")
			);
		}) ?? false
	);
}

function getSearchEditionTitle(book: OpenLibraryBookDoc): string | null {
	const docs = book.editions?.docs ?? [];

	return (
		docs.find((edition) => isEnglishEdition(edition) && edition.title)
			?.title ??
		docs.find((edition) => edition.title)?.title ??
		null
	);
}

function getSearchEditionCoverId(book: OpenLibraryBookDoc): number | null {
	const docs = book.editions?.docs ?? [];

	const edition =
		docs.find((edition) => isEnglishEdition(edition) && edition.cover_i) ??
		docs.find((edition) => edition.cover_i) ??
		null;

	return edition?.cover_i ?? null;
}

function hasUsableEdition(book: OpenLibraryBookDoc): boolean {
	return getSearchEditionTitle(book) !== null;
}

// OpenLibrary edition titles bake series info into the name
// ("Golden Son (Red Rising, #2 of 3)"); the series feature is removed, so
// strip trailing series parentheticals. Keep in sync with stripSeriesInfo
// in packages/backend/convex/migrations/removeMediaSeriesFields.ts.
const seriesSuffix =
	/\s*\((?:[^()]*series[^()]*|[^()]*#\d+ of \d+[^()]*|[^()]*Book \d+[^()]*)\)\s*$/i;

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

function mapOpenLibraryBook(book: OpenLibraryBookDoc) {
	const coverId = getSearchEditionCoverId(book) ?? book.cover_i ?? null;
	const imageUrl = coverId
		? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
		: null;

	return {
		id: book.key.replace(/^\/works\//, ""),
		title: stripSeriesInfo(getSearchEditionTitle(book) ?? book.title),
		author: getAuthorName(book),
		bookAuthorId: book.author_key?.[0] ?? null,
		imageUrl,
		publishYear: book.first_publish_year ?? null,
	};
}

function fetchOpenLibrarySearch(query: string) {
	return providerFetch("openlibrary", () =>
		betterFetch("https://openlibrary.org/search.json", {
			method: "GET",
			signal: AbortSignal.timeout(SEARCH_TIMEOUT_MS),
			query: {
				q: query,
				limit: String(SEARCH_LIMIT),
				fields: openLibrarySearchFields.join(","),
			},
			output: openLibraryBookSearchAPIOutput,
		}),
	);
}

export const searchOpenLibraryBooks = createServerFn({ method: "GET" })
	.validator((data: { searchQuery: string }) => data)
	.handler(async ({ data }) =>
		runProvider(
			Effect.gen(function* () {
				const initialSearch = yield* fetchOpenLibrarySearch(
					data.searchQuery,
				);

				const initialBooks = initialSearch.docs.filter(
					(book) =>
						!looksLikeCollection(book) && hasUsableEdition(book),
				);
				const directResults = initialBooks.map(mapOpenLibraryBook);

				return searchMediaListAPIOutput.parse({
					data: directResults.map((book) =>
						searchMediaAPIOutput.parse({
							imageUrl: book.imageUrl,
							name: book.title,
							releaseYear: book.publishYear,
							sourceId: buildSourceMediaId("book", book.id),
							type: "book",
							creator: book.author,
							bookAuthorId: book.bookAuthorId,
						}),
					),
				});
			}),
		),
	);
