import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { XIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { statusLabel } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import { statusesByMediaType } from "@/types";
import type { LogStatus, MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

type Log = FunctionReturnType<typeof api.logs.all>[0];

type Props = {
	log: Log | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function formatMediaType(type: MediaType) {
	switch (type) {
		case "tv":
			return "TV";
		default:
			return type.charAt(0).toUpperCase() + type.slice(1);
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

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="top-auto right-0 bottom-0 left-0 flex max-h-[85vh] max-w-full translate-x-0 translate-y-0 flex-col overflow-hidden rounded-t-2xl rounded-b-none border border-b-0 border-hairline p-4 shadow-lift sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:max-w-sm sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border-b"
				initialFocus={closeButtonRef}
				showCloseButton={false}
			>
				<DialogHeader className="relative z-10 flex-shrink-0">
					<DialogTitle className="pr-8 font-heading text-lg leading-tight font-normal tracking-tight text-ink">
						{log?.metadata.name || "Untitled"}
					</DialogTitle>
				</DialogHeader>

				<DialogClose
					ref={closeButtonRef}
					render={
						<Button
							variant="ghost"
							className="absolute top-2 right-2 text-muted-foreground hover:text-ink"
							size="icon-sm"
						/>
					}
				>
					<XIcon />
					<span className="sr-only">Close</span>
				</DialogClose>

				{log && (
					<div className="relative z-10 flex flex-col gap-4 overflow-y-auto">
						{/* Media summary */}
						<div className="flex gap-3">
							<div className="h-[120px] w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-soft ring-1 ring-hairline sm:h-[100px] sm:w-[72px]">
								{log.metadata.image ? (
									<Image
										alt={
											log.metadata.name || "Media poster"
										}
										className="h-full w-full object-cover"
										height={120}
										src={log.metadata.image}
										width={80}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<MediaTypeIcon
											className="size-5 text-muted-foreground/50"
											type={log.metadata.type}
										/>
									</div>
								)}
							</div>

							<div className="min-w-0 flex-1 space-y-1 pt-0.5">
								<p className="text-sm font-medium text-ink">
									{formatMediaType(log.metadata.type)}
									{log.metadata.releaseYear ? (
										<span className="text-muted-foreground tabular-nums">
											{" · "}
											{log.metadata.releaseYear}
										</span>
									) : null}
								</p>

								{seriesLabel && (
									<p className="text-xs text-muted-foreground">
										{seriesLabel}
									</p>
								)}

								<p className="pt-1 text-xs text-muted-foreground/70">
									{statusPhrase(
										log.status as LogStatus,
										formatLogDate(log.updatedTime),
									)}
								</p>
							</div>
						</div>

						{/* Status field */}
						<div className="space-y-2">
							<label className="eyebrow block">Status</label>
							<div className="flex flex-wrap gap-2">
								{validStatuses.map((s) => {
									const isActive = status === s;
									return (
										<button
											className={cn(
												"h-8 cursor-pointer rounded-full border px-3 text-xs font-medium transition-all duration-200 disabled:opacity-50 sm:h-7",
												isActive
													? "border-transparent bg-primary text-primary-foreground shadow-soft"
													: "border-hairline-strong bg-transparent text-muted-foreground hover:border-ink/30 hover:text-ink",
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

						{/* Footer actions */}
						<div className="flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-3">
							<Button
								className="text-destructive hover:bg-destructive/10"
								disabled={isLoading}
								onClick={handleDelete}
								size="sm"
								variant="ghost"
							>
								Delete
							</Button>

							<div className="flex items-center gap-2">
								<Button
									disabled={isLoading}
									onClick={() => onOpenChange(false)}
									size="sm"
									variant="outline"
								>
									Cancel
								</Button>
								<Button
									disabled={
										isLoading ||
										status === (log.status as LogStatus)
									}
									onClick={handleSave}
									size="sm"
								>
									Save
								</Button>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
