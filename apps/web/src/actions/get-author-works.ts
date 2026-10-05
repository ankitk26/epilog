import { betterFetch } from "@better-fetch/fetch";
import { createServerFn } from "@tanstack/react-start";
import {
	type AuthorWorksOutput,
	type OpenLibraryWorkSearchOutput,
	openLibraryAuthorAPIOutput,
	openLibraryWorkSearchAPIOutput,
} from "@/types";

const OPEN_LIBRARY_TIMEOUT_MS = 10_000;
const WORK_SEARCH_LIMIT = 100;
// Safety net over the pagination loop: 10 pages × 100 works.
const MAX_WORK_SEARCH_PAGES = 10;
const ENGLISH_LANGUAGE_CODES = new Set(["en", "eng"]);
const BOOK_AUTHOR_ID_PATTERN = /^OL\d+A$/;

// Error artifacts, bulk listings, and catalog records that aren't individual
// works. Keep legitimate short-story collections and essay collections.
const junkPatterns =
	/\*INVALID\*|\bsparknotes\b|literature\s+guide|complete\s+(?:collection|series)|box(ed)?\s+set|set\s+of\s+\d+\s+books|\b(?:sampler|sample|header|copy\s+dump|stock\s+promotion|digital\s+download)\b|\b(?:catalog|catalogue|study\s+guide|textbook|workbook|anthology)\b|\b(?:chinese|japanese|french|german|spanish|italian|russian|korean)\s+edition\b|\b(?:trilogy|duology|tetralogy|omnibus|bundle)\b|\b(?:book|volume|vol\.?)\s*(?:one|two|three|four|five|\d+)\b|\b(?:one|two|three|four|five|\d+)\s+(?:books?|volumes?|novellas?|stories?)\b|\b(?:books?|stories|volumes?|vol\.?)\s+\d+\b|\b\d+\s*\/\s*\d+\b/i;

const allowedEditionFormats = new Set([
	"e-book",
	"ebook",
	"hardcover",
	"mass market paperback",
	"paperback",
]);

function normalizeWorkTitle(title: string) {
	return title
		.toLocaleLowerCase()
		.replace(/[^\p{Letter}\p{Number}]+/gu, " ")
		.replace(/^(?:the|a|an)\s+/, "")
		.trim();
}

const latinScriptPattern = /\p{Script=Latin}/u;

type OpenLibraryWorkDoc = OpenLibraryWorkSearchOutput["docs"][number];

type AuthorWork = {
	id: string;
	title: string;
	imageUrl: string | null;
	publishYear: number | null;
};

function isEnglishEdition(edition: { language?: string[] }) {
	return (
		edition.language?.some((language) => {
			const normalizedLanguage = language.toLowerCase();
			return (
				ENGLISH_LANGUAGE_CODES.has(normalizedLanguage) ||
				normalizedLanguage.endsWith("/eng")
			);
		}) ?? false
	);
}

function isAllowedEditionFormat(edition: { format?: string[] }) {
	if (!edition.format || edition.format.length === 0) return true;

	return edition.format.some((format) =>
		allowedEditionFormats.has(format.toLowerCase().trim()),
	);
}

function getEnglishEdition(doc: OpenLibraryWorkDoc) {
	return doc.editions?.docs.find(
		(edition) =>
			edition.title?.trim() &&
			isEnglishEdition(edition) &&
			isAllowedEditionFormat(edition),
	);
}

// Primary record names can be in a different script (村上春樹), so a
// Latin-script alternate name is preferred for display; all-caps variants
// ("HARUKI MURAKAMI") are deprioritized. All candidates come from the
// author doc itself — no search needed once the id is known.
function getAuthorDisplayName(doc: {
	name?: string;
	alternate_names?: string[];
}): string | null {
	const candidates = [doc.name, ...(doc.alternate_names ?? [])].flatMap(
		(name) => (name ? [name] : []),
	);
	const latinNames = candidates.filter((name) =>
		latinScriptPattern.test(name),
	);

	if (latinNames.length === 0) {
		return candidates[0] ?? null;
	}

	return (
		latinNames.find((name) => name !== name.toUpperCase()) ?? latinNames[0]
	);
}

async function fetchOpenLibraryAuthor(bookAuthorId: string) {
	const { data, error } = await betterFetch(
		`https://openlibrary.org/authors/${bookAuthorId}.json`,
		{
			method: "GET",
			signal: AbortSignal.timeout(OPEN_LIBRARY_TIMEOUT_MS),
			output: openLibraryAuthorAPIOutput,
		},
	);

	if (error) {
		console.error("OpenLibrary author doc error:", error);
	}

	return {
		name: data ? getAuthorDisplayName(data) : null,
		photoId: data?.photos?.find((photo) => photo > 0) ?? null,
	};
}

async function fetchAuthorWorkDocs(
	bookAuthorId: string,
): Promise<OpenLibraryWorkDoc[]> {
	const docs: OpenLibraryWorkDoc[] = [];
	let numFound = Infinity;

	for (
		let offset = 0;
		offset < MAX_WORK_SEARCH_PAGES * WORK_SEARCH_LIMIT &&
		docs.length < numFound;
		offset += WORK_SEARCH_LIMIT
	) {
		const { data, error } = await betterFetch(
			"https://openlibrary.org/search.json",
			{
				method: "GET",
				signal: AbortSignal.timeout(OPEN_LIBRARY_TIMEOUT_MS),
				query: {
					q: `author_key:${bookAuthorId}`,
					language: "eng",
					limit: String(WORK_SEARCH_LIMIT),
					offset: String(offset),
					fields: "key,first_publish_year,editions,editions.title,editions.language,editions.cover_i,editions.format",
				},
				output: openLibraryWorkSearchAPIOutput,
			},
		);

		if (error || !data) {
			console.error("OpenLibrary author works search error:", error);
			// SAFETY: response shape is validated by openLibraryWorkSearchAPIOutput.
			throw new Error("Open Library author works are unavailable");
		}

		numFound = data.numFound;
		docs.push(...data.docs);

		if (data.docs.length < WORK_SEARCH_LIMIT) {
			break;
		}
	}

	return docs;
}

export const getAuthorWorks = createServerFn({ method: "GET" })
	.validator((data: { bookAuthorId: string }) => data)
	.handler(async ({ data }): Promise<AuthorWorksOutput> => {
		if (!BOOK_AUTHOR_ID_PATTERN.test(data.bookAuthorId)) {
			throw new Error("Invalid Open Library author id");
		}

		const [authorDoc, workDocs] = await Promise.all([
			fetchOpenLibraryAuthor(data.bookAuthorId),
			fetchAuthorWorkDocs(data.bookAuthorId),
		]);

		const seenTitles = new Set<string>();
		const currentYear = new Date().getFullYear();
		const works: AuthorWork[] = workDocs
			.map((doc) => {
				const englishEdition = getEnglishEdition(doc);
				const title = englishEdition?.title?.trim() ?? "";
				const coverId = englishEdition?.cover_i;

				return {
					title,
					id: doc.key.replace(/^\/works\//, ""),
					imageUrl:
						coverId && coverId > 0
							? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
							: null,
					publishYear: doc.first_publish_year ?? null,
				};
			})
			.filter(
				(work) =>
					work.title &&
					!junkPatterns.test(work.title) &&
					(work.publishYear === null ||
						work.publishYear <= currentYear),
			)
			.sort(
				(a, b) =>
					(a.publishYear ?? 9999) - (b.publishYear ?? 9999) ||
					a.title.localeCompare(b.title),
			)
			.filter((work) => {
				const normalizedTitle = normalizeWorkTitle(work.title);
				if (seenTitles.has(normalizedTitle)) return false;
				seenTitles.add(normalizedTitle);
				return true;
			});

		return {
			data: {
				author: {
					id: data.bookAuthorId,
					name: authorDoc.name ?? data.bookAuthorId,
					imageUrl: authorDoc.photoId
						? `https://covers.openlibrary.org/a/id/${authorDoc.photoId}-L.jpg`
						: null,
				},
				works,
			},
		};
	});
