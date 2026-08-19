import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import type { MediaCardMedia } from "@/components/media-card";

type Log = FunctionReturnType<typeof api.logs.all>[0];

export function toMediaCardMedia(log: Log): MediaCardMedia {
	return {
		imageUrl: log.metadata.image,
		name: log.metadata.name || "Untitled",
		releaseYear: log.metadata.releaseYear,
		creator: log.metadata.creator,
		type: log.metadata.type,
	};
}
