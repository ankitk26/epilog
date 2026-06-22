import type { MediaType } from "@/types";

const sourceByMediaType: Record<MediaType, "tmdb" | "mal" | "ol"> = {
	movie: "tmdb",
	tv: "tmdb",
	anime: "mal",
	manga: "mal",
	book: "ol",
};

export function buildSourceMediaId(
	mediaType: MediaType,
	nativeId: string | number,
): string {
	return `${sourceByMediaType[mediaType]}:${mediaType}:${nativeId}`;
}
