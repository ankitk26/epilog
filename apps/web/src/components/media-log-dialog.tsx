import {
	CheckIcon,
	SpinnerIcon,
	TrashSimpleIcon,
	XIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import type { ChangeEvent, FocusEvent, ReactNode } from "react";
import { useState } from "react";
import {
	BottomSheetDialogContent,
	Dialog,
	DialogClose,
} from "@/components/bottom-sheet-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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

export type MediaLogDialogMedia = {
	creator?: string | null;
	creatorHref?: string | null;
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	type: MediaType;
};

export type MediaLogDialogValues = {
	pageCount: number | undefined;
	pagesRead: number | undefined;
	status: LogStatus | null;
};

type MediaLogDialogProps = {
	// Replaces the default form body — used by the details dialog to swap
	// in the cover picker.
	body?: ReactNode;
	deleteLabel?: string;
	initialPageCount?: number;
	initialPagesRead?: number;
	initialStatus?: LogStatus | null;
	isDeleting?: boolean;
	isSubmitting?: boolean;
	media: MediaLogDialogMedia;
	// "add" creates a new library entry, "edit" updates an existing one.
	mode: "add" | "edit";
	onDelete?: () => void;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: MediaLogDialogValues) => void;
	open: boolean;
	posterAction?: ReactNode;
	statusNote?: string;
	submitLabel: string;
	submittingLabel: string;
};

/**
 * The single media-log dialog used by both the "add to library" flow and
 * the "edit log" flow. Every visual decision lives here so the two entry
 * points stay identical — they only differ in the data they pass and in
 * the actions they expose.
 */
export default function MediaLogDialog({
	body,
	deleteLabel,
	initialPageCount,
	initialPagesRead,
	initialStatus,
	isDeleting,
	isSubmitting,
	media,
	mode,
	onDelete,
	onOpenChange,
	onSubmit,
	open,
	posterAction,
	statusNote,
	submitLabel,
	submittingLabel,
}: MediaLogDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<BottomSheetDialogContent
				className="h-dvh max-h-dvh w-full max-w-none rounded-none border-0 bg-background sm:h-auto sm:max-h-[92dvh] sm:w-[calc(100%-3rem)] sm:max-w-5xl sm:rounded-xl"
				initialFocus={false}
				showCloseButton={false}
			>
				{body ?? (
					<MediaLogDialogForm
						deleteLabel={deleteLabel}
						initialPageCount={initialPageCount}
						initialPagesRead={initialPagesRead}
						initialStatus={initialStatus}
						isDeleting={isDeleting}
						isSubmitting={isSubmitting}
						media={media}
						mode={mode}
						onDelete={onDelete}
						onOpenChange={onOpenChange}
						onSubmit={onSubmit}
						posterAction={posterAction}
						statusNote={statusNote}
						submitLabel={submitLabel}
						submittingLabel={submittingLabel}
					/>
				)}
			</BottomSheetDialogContent>
		</Dialog>
	);
}

function MediaLogDialogForm({
	deleteLabel,
	initialPageCount,
	initialPagesRead,
	initialStatus,
	isDeleting,
	isSubmitting,
	media,
	mode,
	onDelete,
	onOpenChange,
	onSubmit,
	posterAction,
	statusNote,
	submitLabel,
	submittingLabel,
}: Omit<MediaLogDialogProps, "body" | "open">) {
	const [status, setStatus] = useState<LogStatus | null>(
		initialStatus ?? null,
	);
	const [pageCount, setPageCount] = useState<number | undefined>(
		initialPageCount,
	);
	const [pagesRead, setPagesRead] = useState<number | undefined>(
		initialPagesRead,
	);

	const title = media.name || "Untitled";
	const isBookWithProgress =
		media.type === "book" && (status === "reading" || status === "paused");
	const hasValidPageProgress =
		pageCount === undefined ||
		(pageCount > 0 && (pagesRead ?? 0) <= pageCount);
	const hasChanges =
		status !== (initialStatus ?? null) ||
		pageCount !== initialPageCount ||
		pagesRead !== initialPagesRead;
	// Adding a new entry only needs a status; editing one is saved once
	// something actually changed.
	const canSubmit =
		mode === "add" ? status !== null : hasChanges && hasValidPageProgress;
	const progressPercent =
		isBookWithProgress && pageCount !== undefined && pageCount > 0
			? Math.min(100, Math.round(((pagesRead ?? 0) / pageCount) * 100))
			: undefined;

	const handleSubmit = () => {
		if (!status) return;
		onSubmit({ pageCount, pagesRead, status });
	};

	return (
		<div className="relative flex min-h-0 flex-col overflow-y-auto">
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
				<aside className="flex justify-center gap-4 md:flex-col md:justify-start">
					<div className="flex w-28 shrink-0 flex-col items-center gap-2 md:w-full md:items-start">
						<MediaLogPoster
							imageUrl={media.imageUrl}
							title={title}
						/>
						{posterAction}
					</div>
				</aside>

				<div className="flex min-w-0 flex-col gap-6">
					<MediaLogDialogHeader
						creator={media.creator}
						creatorHref={media.creatorHref}
						mediaType={media.type}
						onCreatorNavigate={() => onOpenChange(false)}
						releaseYear={media.releaseYear}
						statusNote={statusNote}
						title={title}
					/>

					<section className="flex flex-col gap-3">
						<h3 className="section-label">Status</h3>
						<MediaLogStatusList
							disabled={isSubmitting}
							mediaType={media.type}
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
						{onDelete ? (
							<Button
								disabled={isSubmitting}
								onClick={onDelete}
								variant="destructive"
							>
								{isDeleting ? (
									<SpinnerIcon className="size-4 animate-spin" />
								) : (
									<TrashSimpleIcon
										className="size-3.5"
										weight="bold"
									/>
								)}
								{isDeleting
									? "Deleting…"
									: (deleteLabel ?? "Delete")}
							</Button>
						) : (
							<span />
						)}

						<div className="flex items-center gap-2">
							<Button
								disabled={isSubmitting}
								onClick={() => onOpenChange(false)}
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={isSubmitting || !canSubmit}
								onClick={handleSubmit}
							>
								{isSubmitting ? (
									<>
										<SpinnerIcon className="size-4 animate-spin" />
										{submittingLabel}
									</>
								) : (
									submitLabel
								)}
							</Button>
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
}

function MediaLogPoster({
	imageUrl,
	title,
}: {
	imageUrl?: string | null;
	title: string;
}) {
	return (
		<div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-secondary">
			{imageUrl ? (
				<Image
					alt={title}
					className="h-full w-full object-cover"
					height={288}
					src={imageUrl}
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
	);
}

function MediaLogDialogHeader({
	creator,
	creatorHref,
	mediaType,
	onCreatorNavigate,
	releaseYear,
	statusNote,
	title,
}: {
	creator?: string | null;
	creatorHref?: string | null;
	mediaType: MediaType;
	onCreatorNavigate?: () => void;
	releaseYear?: number | null;
	statusNote?: string;
	title: string;
}) {
	const showYear = shouldShowReleaseYear(mediaType) && releaseYear != null;

	return (
		<header className="flex flex-col gap-2 pr-10">
			<h2 className="line-clamp-2 text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl">
				{title}
			</h2>

			{(showYear || creator) && (
				<p className="text-sm text-muted-foreground">
					{showYear && (
						<span className="tabular-nums">{releaseYear}</span>
					)}
					{showYear && creator && " · "}
					{creator &&
						(creatorHref ? (
							<>
								{creatorPhrasePrefix(mediaType) && (
									<span>
										{creatorPhrasePrefix(mediaType)}{" "}
									</span>
								)}
								<Link
									className="font-medium text-foreground underline-offset-2 hover:underline"
									onClick={() => {
										skipDialogHistoryBack();
										onCreatorNavigate?.();
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

			{statusNote && (
				<p className="text-xs text-muted-foreground">{statusNote}</p>
			)}
		</header>
	);
}

function MediaLogStatusList({
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

function ReadingProgressField({
	id,
	label,
	onChange,
	onFocus,
	placeholder,
	value,
}: {
	id: string;
	label: string;
	placeholder: string;
	value: number | undefined;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
}) {
	return (
		<div className="flex flex-col items-start gap-2">
			<label className="section-label" htmlFor={id}>
				{label}
			</label>
			<Input
				className="bg-input/40 px-3 text-sm tabular-nums"
				id={id}
				inputMode="numeric"
				onChange={onChange}
				onFocus={onFocus}
				placeholder={placeholder}
				type="text"
				value={value ?? ""}
			/>
		</div>
	);
}

function ReadingProgressSection({
	children,
	error,
	progressPercent,
}: {
	children: ReactNode;
	error?: string;
	progressPercent?: number;
}) {
	return (
		<div className="space-y-3">
			<h3 className="text-sm font-semibold tracking-tight text-foreground">
				Reading progress
			</h3>
			{children}
			{error && <p className="text-xs text-destructive">{error}</p>}
			{progressPercent !== undefined && (
				<div className="flex w-full items-center gap-2">
					<Progress
						aria-label={`Reading progress ${progressPercent}%`}
						className="min-w-0 flex-1 gap-0 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-secondary"
						value={progressPercent}
					/>
					<span className="shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
						{progressPercent}%
					</span>
				</div>
			)}
		</div>
	);
}

function parsePageValue(value: string): number | undefined {
	const digits = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
	if (digits === "") return undefined;
	return parseInt(digits, 10);
}
