import {
	BookIcon,
	BookOpenIcon,
	FilmSlateIcon,
	TelevisionIcon,
} from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import type { SearchMediaType } from "@/types";

export default function SearchIconByType({
	type,
	...props
}: {
	type: SearchMediaType;
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
