import type { Icon } from "@phosphor-icons/react";
import {
	BookmarkSimpleIcon,
	BookOpenTextIcon,
	CheckCircleIcon,
	EyeIcon,
	HourglassIcon,
	ListPlusIcon,
	XCircleIcon,
} from "@phosphor-icons/react";
import type { LogStatus, MediaType } from "@/types";

export function getStatusIcon(status: LogStatus): Icon {
	switch (status) {
		case "tbr":
			return BookmarkSimpleIcon;
		case "watchlist":
		case "plan_to_watch":
			return ListPlusIcon;
		case "reading":
			return BookOpenTextIcon;
		case "watching":
			return EyeIcon;
		case "finished":
		case "watched":
		case "completed":
			return CheckCircleIcon;
		case "waiting":
			return HourglassIcon;
		case "dnf":
		case "dropped":
			return XCircleIcon;
	}
}

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
