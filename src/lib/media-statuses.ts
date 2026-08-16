export const mediaTypes = ["movie", "tv", "anime", "book", "manga"] as const;
export type MediaType = (typeof mediaTypes)[number];

export const mediaStatusConfig = {
	reading: { label: "Reading", mediaTypes: ["book", "manga"] },
	watching: { label: "Watching", mediaTypes: ["movie", "tv", "anime"] },
	tbr: { label: "TBR", mediaTypes: ["book", "manga"] },
	interested: { label: "Interested", mediaTypes: ["book"] },
	finished: { label: "Finished", mediaTypes: ["book", "manga"] },
	dnf: { label: "DNF", mediaTypes: ["book", "manga"] },
	watchlist: { label: "Watchlist", mediaTypes: ["movie"] },
	watched: { label: "Watched", mediaTypes: ["movie"] },
	plan_to_watch: { label: "Plan to Watch", mediaTypes: ["tv", "anime"] },
	waiting: { label: "Waiting for New Season", mediaTypes: ["tv", "anime"] },
	completed: { label: "Completed", mediaTypes: ["tv", "anime"] },
	dropped: { label: "Dropped", mediaTypes: ["tv", "anime"] },
} as const;

export type LogStatus = keyof typeof mediaStatusConfig;

const logStatuses = Object.keys(mediaStatusConfig).filter(
	(status): status is LogStatus => status in mediaStatusConfig,
);

function statusesForType(type: MediaType): LogStatus[] {
	return logStatuses.filter((status) =>
		mediaStatusConfig[status].mediaTypes.some(
			(mediaType) => mediaType === type,
		),
	);
}

// This is the original order used by list, grid, add, and status-picker views.
export const statusesByMediaType = {
	movie: statusesForType("movie"),
	tv: statusesForType("tv"),
	anime: statusesForType("anime"),
	book: statusesForType("book"),
	manga: statusesForType("manga"),
} satisfies Record<MediaType, LogStatus[]>;

// Shelf-only order: follow the natural movement through a library.
export const shelfStatusesByMediaType = {
	book: ["interested", "tbr", "reading", "finished", "dnf"],
	manga: ["tbr", "reading", "finished", "dnf"],
	movie: ["watchlist", "watching", "watched"],
	tv: ["plan_to_watch", "watching", "waiting", "completed", "dropped"],
	anime: ["plan_to_watch", "watching", "waiting", "completed", "dropped"],
} satisfies Record<MediaType, LogStatus[]>;

export const defaultStatusByMediaType = {
	book: "interested",
	manga: "tbr",
	movie: "watchlist",
	tv: "plan_to_watch",
	anime: "plan_to_watch",
} satisfies Record<MediaType, LogStatus>;

export const validStatusesByMediaType = {
	movie: new Set(statusesByMediaType.movie),
	tv: new Set(statusesByMediaType.tv),
	anime: new Set(statusesByMediaType.anime),
	book: new Set(statusesByMediaType.book),
	manga: new Set(statusesByMediaType.manga),
} satisfies Record<MediaType, Set<LogStatus>>;
