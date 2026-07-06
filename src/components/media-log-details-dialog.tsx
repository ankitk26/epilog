import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { CalendarBlank, TrashSimple, XIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { statusLabel } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import { statusesByMediaType } from "@/types";
import type { LogStatus, MediaType } from "@/types";

type Log = FunctionReturnType<typeof api.logs.all>[0];

type Props = {
	log: Log | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function creatorPhrase(type: MediaType, creator: string): string {
	switch (type) {
		case "tv":
			return `Watch on ${creator}`;
		case "movie":
			return `Directed by ${creator}`;
		case "book":
		case "manga":
			return `Written by ${creator}`;
		case "anime":
			return `Animated by ${creator}`;
		default:
			return creator;
	}
}

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
	const closeButtonRef = useRef<HTMLButtonElement>(null);

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
	const seriesLabel =
		log?.metadata.seriesName &&
		`${log.metadata.seriesName}${
			log.metadata.seriesPosition && log.metadata.seriesTotal
				? ` · ${log.metadata.seriesPosition}/${log.metadata.seriesTotal}`
				: ""
		}`;

	const hasChanges = log && status !== (log.status as LogStatus);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="top-auto right-0 bottom-0 left-0 flex max-h-[85vh] max-w-full translate-x-0 translate-y-0 flex-col overflow-hidden rounded-t-2xl rounded-b-none border border-b-0 border-hairline p-0 shadow-lift sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border-b"
				initialFocus={closeButtonRef}
				showCloseButton={false}
			>
				{/* ── Close button ── */}
				<DialogClose
					ref={closeButtonRef}
					render={
						<Button
							variant="ghost"
							className="absolute top-3 right-3 z-30 text-muted-foreground hover:bg-secondary/60 hover:text-ink"
							size="icon-sm"
						/>
					}
				>
					<XIcon />
					<span className="sr-only">Close</span>
				</DialogClose>

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
										className="h-full w-full scale-110 object-cover opacity-30 blur-2xl saturate-150 dark:opacity-20"
										src={log.metadata.image}
									/>
								</div>
							) : (
								<div className="absolute inset-0 bg-secondary" />
							)}

							{/* Gradient fade at bottom edge */}
							<div className="absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-popover to-transparent" />

							{/* Content: poster + info */}
							<div className="relative z-[2] flex gap-4 px-6 pt-8 pb-6">
								{/* Vertical poster */}
								<div className="h-48 w-36 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-lift ring-1 ring-hairline">
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
											<span className="text-3xl font-heading text-muted-foreground/20">
												{(log.metadata.name || "?").charAt(0).toUpperCase()}
											</span>
										</div>
									)}
								</div>

								{/* Title + metadata */}
								<div className="flex min-w-0 flex-1 flex-col justify-end pb-1">
									<h2 className="line-clamp-2 font-heading text-lg leading-tight font-normal tracking-tight text-ink">
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
										<p className="mt-1.5 text-xs font-medium text-ink/70">
											{creatorPhrase(
												log.metadata.type,
												log.metadata.creator,
											)}
										</p>
									)}

									{seriesLabel && (
										<p className="mt-1 text-xs text-muted-foreground/70">
											{seriesLabel}
										</p>
									)}

									<div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/60">
										<CalendarBlank
											className="size-3"
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
						<div className="flex flex-col gap-6 px-6 pb-6">
							{/* ── Status selector ── */}
							<div className="space-y-3">
								<label className="eyebrow block">Status</label>
								<div className="flex flex-wrap gap-2">
									{validStatuses.map((s) => {
										const isActive = status === s;
										return (
											<button
												className={cn(
													"h-9 cursor-pointer rounded-full border px-4 text-sm font-medium transition-all duration-200 disabled:opacity-50",
													isActive
														? "scale-[1.02] border-transparent bg-primary text-primary-foreground shadow-soft"
														: "border-hairline-strong bg-transparent text-muted-foreground hover:border-ink/30 hover:text-ink active:scale-95",
												)}
												disabled={isLoading}
												key={s}
												onClick={() => setStatus(s)}
												type="button"
											>
												{statusLabel(s, mediaType)}
											</button>
										);
									})}
								</div>
							</div>

							{/* ── Footer actions ── */}
							<div className="flex flex-col gap-3 border-t border-hairline pt-4 sm:flex-row sm:items-center sm:justify-between">
								<Button
									className="h-11 w-full gap-1.5 rounded-full px-4 text-sm font-medium text-destructive hover:bg-destructive/10 sm:h-9 sm:w-auto"
									disabled={isLoading}
									onClick={handleDelete}
									size="sm"
									variant="ghost"
								>
									<TrashSimple
										className="size-3.5"
										weight="bold"
									/>
									Delete
								</Button>

								<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
									<Button
										className="h-11 w-full rounded-full border border-hairline-strong bg-transparent px-4 text-sm font-medium text-ink hover:bg-secondary sm:h-9 sm:w-auto"
										disabled={isLoading}
										onClick={() => onOpenChange(false)}
										size="sm"
										variant="outline"
									>
										Cancel
									</Button>
									<Button
										className="h-11 w-full rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:shadow-lift disabled:opacity-40 sm:h-9 sm:w-auto"
										disabled={isLoading || !hasChanges}
										onClick={handleSave}
										size="sm"
									>
										Save
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
