import type { Id } from "@convex/_generated/dataModel";

export type CalendarMovieEvent = {
	_id: Id<"media">;
	_creationTime: number;
	name: string;
	image?: string | null;
	releaseYear: number | null;
	sourceMediaId: string;
	type: "anime" | "movie" | "tv" | "book";
	movieEventId: Id<"movieEvents">;
	eventDate: string;
};
