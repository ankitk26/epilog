import { BookIcon, FilmSlateIcon, TelevisionIcon } from "@phosphor-icons/react";
import type { IconProps } from "@phosphor-icons/react";
import type { MediaType } from "@/types";

export default function IconByType({
	type,
	...props
}: {
	type: MediaType;
} & IconProps) {
	if (type === "book") {
		return <BookIcon {...props} />;
	}

	if (type === "movie") {
		return <FilmSlateIcon {...props} />;
	}

	return <TelevisionIcon {...props} />;
}
