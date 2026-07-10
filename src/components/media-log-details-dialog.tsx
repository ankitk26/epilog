import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { CalendarBlankIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	BottomSheetDialogContent,
	Dialog,
} from "@/components/bottom-sheet-dialog";
import { Button } from "@/components/ui/button";
import { creatorPhrase } from "@/lib/creator-phrase";
import { getStatusIcon, statusLabel } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import type { LogStatus } from "@/types";
import { statusesByMediaType } from "@/types";

type Log = FunctionReturnType<typeof api.logs.all>[0];

type Props = {
	log: Log | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function formatLogDate(timestamp: number) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}).format(new Date(timestamp));
}

function statusPhrase(status: LogStatus, date: string): string {
	switch (status) {
		case "tbr":
			return `TBR'd on ${date}`;
		case "reading":
			return `Started reading on ${date}`;
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

export default function MediaLogDetailsDialog({
	log,
	open,
	onOpenChange,
}: Props) {
	const mediaType = log?.metadata.type ?? "movie";
	const validStatuses = statusesByMediaType[mediaType];
	const [status, setStatus] = useState<LogStatus>(validStatuses[0]);

	useEffect(() => {
		if (log) {
			setStatus(log.status as LogStatus);
		}
	}, [log]);

	const updateMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.update),
		onMutate: () => {
			toast.loading("Saving changes...");
		},
		onSuccess: () => {
			toast.dismiss();
			toast.success("Log updated");
			onOpenChange(false);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	const removeMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.remove),
		onMutate: () => {
			toast.loading("Removing log...");
		},
		onSuccess: () => {
			toast.dismiss();
			toast.success("Removed log");
			onOpenChange(false);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	const handleSave = () => {
		if (!log) return;
		updateMutation.mutate({ logId: log._id, status });
	};

	const handleDelete = () => {
		if (!log) return;
		removeMutation.mutate({ logId: log._id });
	};

	const isLoading = updateMutation.isPending || removeMutation.isPending;
	const hasChanges = log && status !== (log.status as LogStatus);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<BottomSheetDialogContent showCloseButton initialFocus={false}>
				{log && (
					<div className="flex flex-col overflow-y-auto">
						{/* ── Hero: blurred ambient backdrop + poster card ── */}
						<div className="relative flex-shrink-0">
							{/* Blurred ambient backdrop */}
							{log.metadata.image ? (
								<div className="absolute inset-0 overflow-hidden">
									<img
										alt=""
										aria-hidden="true"
										className="h-full w-full scale-110 object-cover opacity-15 blur-2xl"
										src={log.metadata.image}
									/>
								</div>
							) : (
								<div className="absolute inset-0 bg-secondary" />
							)}

							{/* Gradient fade at bottom edge */}
							<div className="absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-popover to-transparent" />

							{/* Content: poster + info */}
							<div className="relative z-[2] flex gap-3 px-4 pt-6 pb-4 sm:gap-4 sm:px-6 sm:pt-8 sm:pb-6">
								{/* Vertical poster */}
								<div className="h-36 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-lift ring-1 ring-border sm:h-48 sm:w-36">
									{log.metadata.image ? (
										<Image
											alt={
												log.metadata.name ||
												"Media poster"
											}
											className="h-full w-full object-cover"
											height={192}
											src={log.metadata.image}
											width={144}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<span className="font-heading text-3xl text-muted-foreground/20">
												{(log.metadata.name || "?")
													.charAt(0)
													.toUpperCase()}
											</span>
										</div>
									)}
								</div>

								{/* Title + metadata */}
								<div className="flex min-w-0 flex-1 flex-col justify-end pb-1">
									<h2 className="line-clamp-2 font-heading text-lg leading-tight font-medium tracking-tight text-foreground">
										{log.metadata.name || "Untitled"}
									</h2>

									<div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
										{log.metadata.releaseYear && (
											<span className="tabular-nums">
												{log.metadata.releaseYear}
											</span>
										)}
									</div>

									{log.metadata.creator && (
										<p className="mt-1.5 text-xs font-medium text-foreground/70">
											{creatorPhrase(
												log.metadata.type,
												log.metadata.creator,
											)}
										</p>
									)}

									<div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/60">
										<CalendarBlankIcon
											className="hidden size-3 sm:block"
											weight="bold"
										/>
										<span>
											{statusPhrase(
												log.status as LogStatus,
												formatLogDate(log.updatedTime),
											)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* ── Body ── */}
						<div className="flex flex-col gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
							{/* ── Status selector ── */}
							<div className="space-y-3">
								<div className="flex flex-col overflow-hidden rounded-lg border border-border">
									{validStatuses.map((s, index) => {
										const isActive = status === s;
										const StatusIcon = getStatusIcon(s);
										return (
											<button
												className={cn(
													"relative flex w-full cursor-pointer items-center gap-3 py-3 pr-4 pl-4 text-left text-sm transition-colors duration-150 disabled:opacity-50",
													index > 0 &&
														"border-t border-border",
													isActive
														? "bg-primary/[0.04]"
														: "hover:bg-secondary/60",
												)}
												disabled={isLoading}
												key={s}
												onClick={() => setStatus(s)}
												type="button"
											>
												<StatusIcon
													className={cn(
														"size-4 shrink-0 transition-colors duration-150",
														isActive
															? "text-primary"
															: "text-muted-foreground",
													)}
													weight={
														isActive
															? "fill"
															: "regular"
													}
												/>
												<span
													className={cn(
														"flex-1 font-medium transition-colors duration-150",
														isActive
															? "text-foreground"
															: "text-muted-foreground",
													)}
												>
													{statusLabel(s, mediaType)}
												</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* ── Footer actions ── */}
							<div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
								<Button
									className="w-full sm:w-auto"
									disabled={isLoading}
									onClick={handleDelete}
									variant="destructive"
								>
									<TrashSimpleIcon
										className="size-3.5"
										weight="bold"
									/>
									Delete
								</Button>

								<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
									<Button
										className="w-full sm:w-auto"
										disabled={isLoading}
										onClick={() => onOpenChange(false)}
										variant="outline"
									>
										Cancel
									</Button>
									<Button
										className="w-full sm:w-auto"
										disabled={isLoading || !hasChanges}
										onClick={handleSave}
									>
										Save
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</BottomSheetDialogContent>
		</Dialog>
	);
}
