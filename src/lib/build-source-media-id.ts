import type { MediaType } from "@/types";

const sourceByMediaType = {
	movie: "tmdb",
	tv: "tmdb",
	anime: "mal",
	manga: "mal",
	book: "ol",
} satisfies Record<MediaType, "tmdb" | "mal" | "ol">;

export function buildSourceMediaId(
	mediaType: MediaType,
	nativeId: string | number,
): string {
	return `${sourceByMediaType[mediaType]}:${mediaType}:${nativeId}`;
}
