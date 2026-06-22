import type { LogStatus, MediaType } from "@/types";

export function statusLabel(status: LogStatus, _type: MediaType): string {
	switch (status) {
		case "tbr":
			return "TBR";
		case "reading":
			return "Reading";
		case "finished":
			return "Finished";
		case "dnf":
			return "DNF";
		case "watchlist":
			return "Watchlist";
		case "watching":
			return "Watching";
		case "watched":
			return "Watched";
		case "plan_to_watch":
			return "Plan to Watch";
		case "waiting":
			return "Waiting for New Season";
		case "completed":
			return "Completed";
		case "dropped":
			return "Dropped";
	}
}
