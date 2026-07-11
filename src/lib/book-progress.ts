import type { api } from "@convex/_generated/api";
import type { FunctionReturnType } from "convex/server";

export type LogWithProgress = FunctionReturnType<typeof api.logs.all>[0];

export function getBookProgress(log: LogWithProgress) {
	if (log.metadata.type !== "book" || log.status !== "reading") {
		return null;
	}

	const total = log.pageCount ?? 0;
	if (total <= 0) return null;

	const read = Math.min(log.pagesRead ?? 0, total);
	const percent = Math.round((read / total) * 100);

	return { total, read, percent };
}
