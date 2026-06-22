import type { MediaType } from "@/types";

const readingTypes: ReadonlySet<MediaType> = new Set(["book", "manga"]);

export function plannedLabel(type: MediaType): string {
	return readingTypes.has(type) ? "To Read" : "To Watch";
}

export function inProgressLabel(type: MediaType): string {
	return readingTypes.has(type) ? "Reading" : "Watching";
}
