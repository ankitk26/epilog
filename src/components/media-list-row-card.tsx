import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";
import { getBookProgress } from "@/lib/book-progress";
import LogItem from "./log-item";

type Props = {
	log: FunctionReturnType<typeof api.logs.all>[0];
	onClick?: () => void;
};

export default function MediaListRowCard({ log, onClick }: Props) {
	return (
		<LogItem.List
			media={{
				imageUrl: log.metadata.image,
				name: log.metadata.name || "Untitled",
				releaseYear: log.metadata.releaseYear,
				creator: log.metadata.creator,
				type: log.metadata.type,
			}}
			onClick={onClick}
			progress={getBookProgress(log)}
		/>
	);
}
