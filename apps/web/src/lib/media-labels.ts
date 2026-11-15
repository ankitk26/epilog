import type { Icon } from "@phosphor-icons/react";
import {
	BookmarkSimpleIcon,
	BookOpenTextIcon,
	CheckCircleIcon,
	EyeIcon,
	HourglassIcon,
	ListPlusIcon,
	PauseIcon,
	StarIcon,
	XCircleIcon,
} from "@phosphor-icons/react";
import type { LogStatus, MediaType } from "@/types";
import { mediaStatusConfig } from "./media-statuses";

export function getStatusIcon(status: LogStatus): Icon {
	switch (status) {
		case "interested":
			return StarIcon;
		case "tbr":
			return BookmarkSimpleIcon;
		case "watchlist":
		case "plan_to_watch":
			return ListPlusIcon;
		case "reading":
			return BookOpenTextIcon;
		case "watching":
			return EyeIcon;
		case "paused":
			return PauseIcon;
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
	return mediaStatusConfig[status].label;
}

export function shouldShowReleaseYear(type: MediaType): boolean {
	return type === "movie" || type === "tv";
}

export function formatLogDate(timestamp: number): string {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(timestamp));
}

export function statusPhrase(status: LogStatus, date: string): string {
	switch (status) {
		case "interested":
			return `Interested since ${date}`;
		case "tbr":
			return `TBR'd on ${date}`;
		case "reading":
			return `Started reading on ${date}`;
		case "paused":
			return `Paused on ${date}`;
		case "finished":
			return `Finished on ${date}`;
		case "dnf":
			return `DNF'd on ${date}`;
		case "watchlist":
			return `Added to watchlist on ${date}`;
		case "watching":
			return `Started watching on ${date}`;
		case "watched":
			return `Watched on ${date}`;
		case "plan_to_watch":
			return `Bookmarked on ${date}`;
		case "waiting":
			return `Waiting since ${date}`;
		case "completed":
			return `Completed on ${date}`;
		case "dropped":
			return `Dropped on ${date}`;
	}
}
