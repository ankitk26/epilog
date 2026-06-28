import {
	BookIcon,
	BookOpenIcon,
	FilmSlateIcon,
	TelevisionIcon,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import type { MediaType } from "@/types";

export default function MediaTypeIcon({
	type,
	...props
}: {
	type: MediaType;
} & IconProps) {
	if (type === "book") {
		return <BookIcon {...props} />;
	}

	if (type === "manga") {
		return <BookOpenIcon {...props} />;
	}

	if (type === "movie") {
		return <FilmSlateIcon {...props} />;
	}

	return <TelevisionIcon {...props} />;
}
