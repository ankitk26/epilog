import type { MediaType } from "@/types";

export function creatorPhrase(type: MediaType, creator: string): string {
	switch (type) {
		case "tv":
			return `Watch on ${creator}`;
		case "movie":
			return `Directed by ${creator}`;
		case "book":
		case "manga":
			return `Written by ${creator}`;
		case "anime":
			return `Animated by ${creator}`;
		default:
			return creator;
	}
}
