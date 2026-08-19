import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { SpinnerIcon, TrashSimpleIcon, XIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	BottomSheetDialogContent,
	Dialog,
	DialogClose,
} from "@/components/bottom-sheet-dialog";
import {
	MediaLogDialogHero,
	MediaLogStatusPicker,
	ReadingProgressField,
	ReadingProgressSection,
} from "@/components/media-log-dialog-parts";
import { Button } from "@/components/ui/button";
import { shelfStatusesByMediaType } from "@/types";
import type { LogStatus } from "@/types";

type Log = FunctionReturnType<typeof api.logs.all>[0];

type Props = {
	log: Log | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function asLogStatus(status: string): LogStatus {
	// SAFETY: log statuses are constrained by the Convex schema.
	return status as LogStatus;
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
		case "interested":
			return `Interested since ${date}`;
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

function parsePageValue(value: string): number | undefined {
	const digits = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
	if (digits === "") return undefined;
	return parseInt(digits, 10);
}

export default function MediaLogDetailsDialog({
	log,
	open,
	onOpenChange,
}: Props) {
	const mediaType = log?.metadata.type ?? "movie";
	const validStatuses = shelfStatusesByMediaType[mediaType];
	const [status, setStatus] = useState<LogStatus>(validStatuses[0]);
	const [pageCount, setPageCount] = useState<number | undefined>(undefined);
	const [pagesRead, setPagesRead] = useState<number | undefined>(undefined);

	useEffect(() => {
		if (log) {
			setStatus(asLogStatus(log.status));
			setPageCount(log.pageCount ?? undefined);
			setPagesRead(log.pagesRead ?? 0);
		}
	}, [log]);

	const updateMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.update),
		onSuccess: () => onOpenChange(false),
		onError: () => toast.error("Something went wrong!"),
	});

	const removeMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.remove),
		onSuccess: () => onOpenChange(false),
		onError: () => toast.error("Something went wrong!"),
	});

	const handleSave = () => {
		if (!log) return;

		updateMutation.mutate({
			logId: log._id,
			status,
			...(pageCount !== undefined && { pageCount }),
			...(pagesRead !== undefined && { pagesRead }),
		});
	};

	const handleDelete = () => {
		if (!log) return;
		removeMutation.mutate({ logId: log._id });
	};

	const isLoading = updateMutation.isPending || removeMutation.isPending;
	const initialPageCount = log?.pageCount ?? undefined;
	const initialPagesRead = log?.pagesRead ?? 0;
	const hasChanges =
		!!log &&
		(status !== asLogStatus(log.status) ||
			pageCount !== initialPageCount ||
			pagesRead !== initialPagesRead);
	const isReadingBook = mediaType === "book" && status === "reading";
	const hasValidPageProgress =
		pageCount !== undefined &&
		pageCount > 0 &&
		(pagesRead ?? 0) <= pageCount;
	const canSave = !!log && (!isReadingBook || hasValidPageProgress);
	const progressPercent =
		isReadingBook && pageCount !== undefined && pageCount > 0
			? Math.min(100, Math.round(((pagesRead ?? 0) / pageCount) * 100))
			: undefined;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<BottomSheetDialogContent
				className="h-[100dvh] max-h-[100dvh] rounded-t-xl sm:h-auto sm:max-h-[85dvh] sm:rounded-xl"
				showCloseButton={false}
				initialFocus={false}
			>
				<DialogClose
					render={
						<Button
							className="absolute top-5 right-5 z-10"
							size="icon-sm"
							variant="ghost"
						/>
					}
				>
					<XIcon />
					<span className="sr-only">Close</span>
				</DialogClose>

				{log && (
					<div className="flex flex-col overflow-y-auto">
						<MediaLogDialogHero
							creator={log.metadata.creator}
							media={{
								imageUrl: log.metadata.image,
								name: log.metadata.name || "Untitled",
								releaseYear: log.metadata.releaseYear,
								creator: log.metadata.creator,
								type: log.metadata.type,
							}}
							statusDate={statusPhrase(
								asLogStatus(log.status),
								formatLogDate(log.updatedTime),
							)}
						/>

						<div className="flex flex-col gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
							<MediaLogStatusPicker
								disabled={isLoading}
								mediaType={mediaType}
								onChange={setStatus}
								value={status}
							/>

							{isReadingBook && (
								<ReadingProgressSection
									error={
										pagesRead !== undefined &&
										pageCount !== undefined &&
										pagesRead > pageCount
											? "Pages read cannot exceed total pages."
											: undefined
									}
									progressPercent={progressPercent}
								>
									<div className="grid grid-cols-2 gap-3">
										<ReadingProgressField
											id="total-pages"
											label="Total pages"
											onChange={(event) =>
												setPageCount(
													parsePageValue(
														event.target.value,
													),
												)
											}
											onFocus={(event) =>
												event.currentTarget.select()
											}
											placeholder="300"
											value={pageCount}
										/>
										<ReadingProgressField
											id="pages-read"
											label="Pages read"
											onChange={(event) =>
												setPagesRead(
													parsePageValue(
														event.target.value,
													),
												)
											}
											onFocus={(event) =>
												event.currentTarget.select()
											}
											placeholder="0"
											value={pagesRead}
										/>
									</div>
								</ReadingProgressSection>
							)}

							<div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
								<Button
									className="w-full sm:w-auto"
									disabled={isLoading}
									onClick={handleDelete}
									variant="destructive"
								>
									{removeMutation.isPending ? (
										<SpinnerIcon className="size-4 animate-spin" />
									) : (
										<TrashSimpleIcon
											className="size-3.5"
											weight="bold"
										/>
									)}
									{removeMutation.isPending
										? "Deleting…"
										: "Delete"}
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
										disabled={
											isLoading || !hasChanges || !canSave
										}
										onClick={handleSave}
									>
										{updateMutation.isPending ? (
											<SpinnerIcon className="size-4 animate-spin" />
										) : (
											"Save"
										)}
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
