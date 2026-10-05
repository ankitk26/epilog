import type { MediaType } from "@/types";

export function creatorPhrasePrefix(type: MediaType): string | null {
	switch (type) {
		case "tv":
			return "Watch on";
		case "movie":
			return "Directed by";
		case "book":
		case "manga":
			return "Written by";
		case "anime":
			return "Animated by";
		default:
			return null;
	}
}

export function creatorPhrase(type: MediaType, creator: string): string {
	const prefix = creatorPhrasePrefix(type);
	return prefix ? `${prefix} ${creator}` : creator;
}
