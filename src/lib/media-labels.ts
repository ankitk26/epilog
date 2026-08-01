import type { Icon } from "@phosphor-icons/react";
import {
	BookmarkSimpleIcon,
	BookOpenTextIcon,
	CheckCircleIcon,
	EyeIcon,
	HourglassIcon,
	ListPlusIcon,
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
