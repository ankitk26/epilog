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

export const statusesByMediaType = Object.fromEntries(
	mediaTypes.map((type) => [
		type,
		(Object.keys(mediaStatusConfig) as LogStatus[]).filter((status) =>
			mediaStatusConfig[status].mediaTypes.some(
				(mediaType) => mediaType === type,
			),
		),
	]),
) as Record<MediaType, LogStatus[]>;

export const defaultStatusByMediaType: Record<MediaType, LogStatus> = {
	book: "interested",
	manga: "tbr",
	movie: "watchlist",
	tv: "plan_to_watch",
	anime: "plan_to_watch",
};

export const validStatusesByMediaType = Object.fromEntries(
	mediaTypes.map((type) => [type, new Set(statusesByMediaType[type])]),
) as Record<MediaType, Set<LogStatus>>;
