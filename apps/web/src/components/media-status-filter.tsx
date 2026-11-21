import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	SegmentedControl,
	SegmentedControlIndicator,
	SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { statusLabel } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import { shelfStatusesByMediaType } from "@/types";
import type { LogStatus } from "@/types";

export default function MediaStatusFilter() {
	const { type: mediaType, status, view, setStatus } = useMediaFilters();

	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	// Calendar shows movie events rather than status groups.
	if (view === "calendar") {
		return null;
	}

	const logsForType = logs.filter((log) => log.metadata.type === mediaType);

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
		<SegmentedControl
			aria-label="Filter by status"
			className="max-w-full gap-2 overflow-x-auto border-0 bg-transparent p-0 [--ui-background:var(--primary)] [--ui-foreground:var(--foreground)] [--ui-muted-foreground:var(--muted-foreground)]"
			value={status}
			onValueChange={(next) => {
				if (next) {
					setStatus(next);
				}
			}}
		>
			<SegmentedControlIndicator className="rounded-md transition-[top,left,width,height] duration-200 ease-out data-[activation-direction=none]:transition-none" />
			{items.map((item) => {
				const isActive = status === item.status;
				return (
					<SegmentedControlItem
						className="group flex-none gap-1 rounded-md text-xs data-checked:text-primary-foreground"
						key={item.status}
						value={item.status}
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
					</SegmentedControlItem>
				);
			})}
		</SegmentedControl>
	);
}
