import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import {
	CheckIcon,
	ImagesIcon,
	SpinnerIcon,
	TrashSimpleIcon,
	XIcon,
} from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { toast } from "sonner";
import BookCoverPicker from "@/components/book-cover-picker";
import {
	BottomSheetDialogContent,
	Dialog,
	DialogClose,
} from "@/components/bottom-sheet-dialog";
import {
	ReadingProgressField,
	ReadingProgressSection,
} from "@/components/media-log-dialog-parts";
import { Button } from "@/components/ui/button";
import { skipDialogHistoryBack } from "@/hooks/use-dialog-history";
import { creatorPhrase, creatorPhrasePrefix } from "@/lib/creator-phrase";
import {
	getStatusIcon,
	shouldShowReleaseYear,
	statusLabel,
} from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import type { LogStatus, MediaType } from "@/types";
import { shelfStatusesByMediaType } from "@/types";

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
		case "paused":
			return `Paused on ${date}`;
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
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<BottomSheetDialogContent
				className="h-dvh max-h-dvh w-full max-w-none rounded-none border-0 bg-background sm:h-auto sm:max-h-[92dvh] sm:w-[calc(100%-3rem)] sm:max-w-5xl sm:rounded-xl"
				showCloseButton={false}
				initialFocus={false}
			>
				{open && log && (
					<MediaLogDetailsDialogContent
						key={log._id}
						log={log}
						onOpenChange={onOpenChange}
					/>
				)}
			</BottomSheetDialogContent>
		</Dialog>
	);
}

function StatusList({
	disabled,
	mediaType,
	onChange,
	value,
}: {
	disabled?: boolean;
	mediaType: MediaType;
	onChange: (status: LogStatus) => void;
	value: LogStatus | null;
}) {
	return (
		<div
			aria-label="Status"
			className="flex flex-col gap-1"
			role="radiogroup"
		>
			{shelfStatusesByMediaType[mediaType].map((status, index) => {
				const isActive = value === status;
				const StatusIcon = getStatusIcon(status);

				return (
					<button
						aria-checked={isActive}
						className={cn(
							"flex h-10 items-center gap-3 rounded-md px-3 text-left text-sm disabled:opacity-50",
							isActive
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground fine-hover:hover:bg-secondary fine-hover:hover:text-foreground",
						)}
						disabled={disabled}
						key={status}
						onClick={() => onChange(status)}
						role="radio"
						type="button"
					>
						<span className="w-4 text-xs tabular-nums opacity-70">
							{index + 1}
						</span>
						<StatusIcon
							className="size-4 shrink-0"
							weight={isActive ? "fill" : "regular"}
						/>
						<span className="flex-1 truncate">
							{statusLabel(status, mediaType)}
						</span>
						{isActive && <CheckIcon className="size-4 shrink-0" />}
					</button>
				);
			})}
		</div>
	);
}

function PosterBackdrop({ src }: { src: string | null | undefined }) {
	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 overflow-hidden"
		>
			{src && (
				<img
					alt=""
					className="h-full w-full scale-110 object-cover opacity-40 blur-2xl"
					src={src}
				/>
			)}
			<div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background" />
		</div>
	);
}

function MediaLogDetailsDialogContent({
	log,
	onOpenChange,
}: {
	log: Log;
	onOpenChange: (open: boolean) => void;
}) {
	const mediaType = log.metadata.type;
	const [status, setStatus] = useState<LogStatus>(asLogStatus(log.status));
	const [pageCount, setPageCount] = useState<number | undefined>(
		log.pageCount ?? undefined,
	);
	const [pagesRead, setPagesRead] = useState<number | undefined>(
		log.pagesRead ?? 0,
	);
	const [view, setView] = useState<"main" | "covers">("main");
	const [customImage, setCustomImage] = useState<string | null | undefined>(
		log.customImage ?? undefined,
	);

	const updateCoverMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.updateCover),
		onSuccess: () => {
			toast.success("Cover updated");
			setView("main");
		},
		onError: () => toast.error("Something went wrong!"),
	});

	const handleApplyCover = (coverUrl: string | null) => {
		setCustomImage(coverUrl);
		updateCoverMutation.mutate({ logId: log._id, customImage: coverUrl });
	};

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
		updateMutation.mutate({
			logId: log._id,
			status,
			...(pageCount !== undefined && { pageCount }),
			...(pagesRead !== undefined && { pagesRead }),
		});
	};

	const handleDelete = () => {
		removeMutation.mutate({ logId: log._id });
	};

	const isLoading = updateMutation.isPending || removeMutation.isPending;
	const initialPageCount = log.pageCount ?? undefined;
	const initialPagesRead = log.pagesRead ?? 0;
	const hasChanges =
		status !== asLogStatus(log.status) ||
		pageCount !== initialPageCount ||
		pagesRead !== initialPagesRead;
	const isBookWithProgress =
		mediaType === "book" && (status === "reading" || status === "paused");
	const hasValidPageProgress =
		pageCount === undefined ||
		(pageCount > 0 && (pagesRead ?? 0) <= pageCount);
	const canSave = !isBookWithProgress || hasValidPageProgress;
	const progressPercent =
		isBookWithProgress && pageCount !== undefined && pageCount > 0
			? Math.min(100, Math.round(((pagesRead ?? 0) / pageCount) * 100))
			: undefined;

	const posterUrl = customImage ?? log.customImage ?? log.metadata.image;
	const title = log.metadata.name || "Untitled";
	const creator = log.metadata.creator;
	const creatorHref =
		mediaType === "book" && log.metadata.bookAuthorId
			? log.metadata.bookAuthorId
			: null;
	const showYear =
		shouldShowReleaseYear(mediaType) && log.metadata.releaseYear != null;
	const statusDate = statusPhrase(
		asLogStatus(log.status),
		formatLogDate(log.updatedTime),
	);
	const canChangeCover = mediaType === "book" && !!log.metadata.sourceMediaId;

	if (view === "covers" && log.metadata.sourceMediaId) {
		return (
			<div className="relative flex min-h-0 flex-1 flex-col">
				<PosterBackdrop src={posterUrl} />
				<div className="relative flex min-h-0 flex-1 flex-col">
					<BookCoverPicker
						active
						defaultImage={log.metadata.image}
						isApplying={updateCoverMutation.isPending}
						onApply={handleApplyCover}
						onBack={() => setView("main")}
						value={customImage ?? null}
						workId={
							log.metadata.sourceMediaId.split(":").pop() ?? ""
						}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className="relative flex min-h-0 flex-col overflow-y-auto">
			<PosterBackdrop src={posterUrl} />

			<DialogClose
				render={
					<Button
						className="absolute top-3 right-3 z-10"
						size="icon-sm"
						variant="ghost"
					/>
				}
			>
				<XIcon />
				<span className="sr-only">Close</span>
			</DialogClose>

			<div className="relative grid gap-6 p-4 sm:gap-8 sm:p-6 md:grid-cols-[16rem_1fr] lg:grid-cols-[18rem_1fr]">
				<aside className="flex gap-4 md:flex-col">
					<div className="flex w-28 shrink-0 flex-col gap-2 md:w-full">
						<div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-secondary">
							{posterUrl ? (
								<Image
									alt={title}
									className="h-full w-full object-cover"
									height={288}
									src={posterUrl}
									width={192}
								/>
							) : (
								<div className="flex h-full w-full items-center justify-center">
									<span className="text-3xl text-muted-foreground/40">
										{title.charAt(0).toUpperCase()}
									</span>
								</div>
							)}
						</div>
						{canChangeCover && (
							<Button
								className="w-full"
								onClick={() => setView("covers")}
								size="sm"
								variant="outline"
							>
								<ImagesIcon />
								Change cover
							</Button>
						)}
					</div>
				</aside>

				<div className="flex min-w-0 flex-col gap-6">
					<header className="flex flex-col gap-2 pr-10">
						<h2 className="line-clamp-2 text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl">
							{title}
						</h2>

						{(showYear || creator) && (
							<p className="text-sm text-muted-foreground">
								{showYear && (
									<span className="tabular-nums">
										{log.metadata.releaseYear}
									</span>
								)}
								{showYear && creator && " · "}
								{creator &&
									(creatorHref ? (
										<>
											{creatorPhrasePrefix(mediaType) && (
												<span>
													{creatorPhrasePrefix(
														mediaType,
													)}{" "}
												</span>
											)}
											<Link
												className="font-medium text-foreground underline-offset-2 hover:underline"
												onClick={() => {
													skipDialogHistoryBack();
													onOpenChange(false);
												}}
												params={{
													bookAuthorId: creatorHref,
												}}
												to="/authors/$bookAuthorId"
											>
												{creator}
											</Link>
										</>
									) : (
										creatorPhrase(mediaType, creator)
									))}
							</p>
						)}

						<p className="text-xs text-muted-foreground">
							{statusDate}
						</p>
					</header>

					<section className="flex flex-col gap-3">
						<h3 className="section-label">Status</h3>
						<StatusList
							disabled={isLoading}
							mediaType={mediaType}
							onChange={setStatus}
							value={status}
						/>
					</section>

					{isBookWithProgress && (
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
											parsePageValue(event.target.value),
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
											parsePageValue(event.target.value),
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

					<footer className="mt-auto flex items-center justify-between gap-3 pt-2">
						<Button
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
							{removeMutation.isPending ? "Deleting…" : "Delete"}
						</Button>

						<div className="flex items-center gap-2">
							<Button
								disabled={isLoading}
								onClick={() => onOpenChange(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={isLoading || !hasChanges || !canSave}
								onClick={handleSave}
							>
								{updateMutation.isPending ? (
									<>
										<SpinnerIcon className="size-4 animate-spin" />
										Saving…
									</>
								) : (
									"Save"
								)}
							</Button>
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
}
