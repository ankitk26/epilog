import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { statusLabel } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import { shelfStatusesByMediaType } from "@/types";
import type { LogStatus } from "@/types";
import { Button } from "./ui/button";

export default function MediaStatusFilter() {
	const { type: mediaType, status, view, setStatus } = useMediaFilters();

	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	// Calendar shows movie events rather than status groups, and the shelf
	// view keeps all its status columns, so the filter has no effect there.
	if (view === "calendar" || view === "shelf") {
		return null;
	}

	const logsForType = logs.filter((log) => log.metadata.type === mediaType);

	// Follow the shelf's natural library-movement order so the pills read
	// the same way across views.
	const items: {
		status: LogStatus;
		label: string;
		count: number;
	}[] = shelfStatusesByMediaType[mediaType].map((statusOption) => ({
		status: statusOption,
		label: statusLabel(statusOption, mediaType),
		count: logsForType.filter((log) => log.status === statusOption).length,
	}));

	return (
		<div className="flex flex-wrap items-center gap-2">
			{items.map((item) => {
				const isActive = status === item.status;
				return (
					<Button
						className={cn(
							"group text-xs",
							isActive
								? "bg-primary! text-primary-foreground fine-hover:hover:text-primary-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
						key={item.status}
						onClick={() => setStatus(item.status)}
						size="sm"
						variant="outline"
					>
						{item.label}
						<span
							className={cn(
								"flex min-w-5 items-center justify-center rounded-full px-1 text-xs leading-none",
								isActive
									? "bg-primary-foreground/20 text-primary-foreground"
									: "bg-secondary text-muted-foreground fine-hover:group-hover:text-foreground",
							)}
						>
							{item.count}
						</span>
					</Button>
				);
			})}
		</div>
	);
}
