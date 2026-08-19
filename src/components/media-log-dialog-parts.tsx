import { CalendarBlankIcon } from "@phosphor-icons/react";
import { Image } from "@unpic/react";
import type { ChangeEvent, FocusEvent, ReactNode } from "react";
import { creatorPhrase } from "@/lib/creator-phrase";
import {
	getStatusIcon,
	shouldShowReleaseYear,
	statusLabel,
} from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import type { LogStatus, MediaType } from "@/types";
import { shelfStatusesByMediaType } from "@/types";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";

export type MediaDialogMedia = {
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	creator?: string | null;
	type: MediaType;
};

type MediaLogDialogHeroProps = {
	media: MediaDialogMedia;
	creator?: string | null;
	statusDate?: string;
};

export function MediaLogDialogHero({
	creator,
	media,
	statusDate,
}: MediaLogDialogHeroProps) {
	const resolvedCreator = creator ?? media.creator;

	return (
		<div className="relative flex-shrink-0">
			{media.imageUrl ? (
				<div className="absolute inset-0 overflow-hidden">
					<img
						alt=""
						aria-hidden="true"
						className="h-full w-full scale-110 object-cover opacity-15 blur-2xl"
						src={media.imageUrl}
					/>
				</div>
			) : (
				<div className="absolute inset-0 bg-secondary" />
			)}

			<div className="absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-popover to-transparent" />

			<div className="relative z-[2] flex gap-3 px-4 pt-6 pb-4 sm:gap-4 sm:px-6 sm:pt-8 sm:pb-6">
				<div className="aspect-[2/3] w-28 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-lift ring-1 ring-border sm:w-36">
					{media.imageUrl ? (
						<Image
							alt={media.name || "Media poster"}
							className="h-full w-full object-cover"
							height={216}
							src={media.imageUrl}
							width={144}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<span className="font-heading text-3xl text-muted-foreground/20">
								{(media.name || "?").charAt(0).toUpperCase()}
							</span>
						</div>
					)}
				</div>

				<div className="flex min-w-0 flex-1 flex-col justify-end pb-1">
					<h2 className="line-clamp-2 font-heading text-lg leading-tight font-medium tracking-tight text-foreground">
						{media.name || "Untitled"}
					</h2>

					{shouldShowReleaseYear(media.type) &&
						media.releaseYear != null && (
							<div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
								<span className="tabular-nums">
									{media.releaseYear}
								</span>
							</div>
						)}

					{resolvedCreator && (
						<p className="mt-1 text-xs font-medium text-foreground/70">
							{creatorPhrase(media.type, resolvedCreator)}
						</p>
					)}

					{statusDate && (
						<div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/60">
							<CalendarBlankIcon
								className="hidden size-3 sm:block"
								weight="bold"
							/>
							<span>{statusDate}</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

type MediaLogStatusPickerProps = {
	disabled?: boolean;
	mediaType: MediaType;
	value: LogStatus | null;
	onChange: (status: LogStatus) => void;
};

export function MediaLogStatusPicker({
	disabled,
	mediaType,
	onChange,
	value,
}: MediaLogStatusPickerProps) {
	return (
		<div className="flex flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-soft">
			{shelfStatusesByMediaType[mediaType].map((status, index) => {
				const isActive = value === status;
				const StatusIcon = getStatusIcon(status);

				return (
					<button
						className={cn(
							"relative flex w-full cursor-pointer items-center gap-3 py-3 pr-4 pl-4 text-left text-sm transition-colors duration-150 disabled:opacity-50",
							index > 0 && "border-t border-border",
							isActive
								? "bg-primary/[0.04]"
								: "fine-hover:hover:bg-secondary/60",
						)}
						disabled={disabled}
						key={status}
						onClick={() => onChange(status)}
						type="button"
					>
						<StatusIcon
							className={cn(
								"size-4 shrink-0 transition-colors duration-150",
								isActive
									? "text-primary"
									: "text-muted-foreground",
							)}
							weight={isActive ? "fill" : "regular"}
						/>
						<span
							className={cn(
								"flex-1 font-medium transition-colors duration-150",
								isActive
									? "text-foreground"
									: "text-muted-foreground",
							)}
						>
							{statusLabel(status, mediaType)}
						</span>
					</button>
				);
			})}
		</div>
	);
}

type ReadingProgressFieldProps = {
	id: string;
	label: string;
	placeholder: string;
	value: number | undefined;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
};

export function ReadingProgressField({
	id,
	label,
	onChange,
	onFocus,
	placeholder,
	value,
}: ReadingProgressFieldProps) {
	return (
		<div className="space-y-2">
			<label className="section-label" htmlFor={id}>
				{label}
			</label>
			<Input
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

type ReadingProgressSectionProps = {
	children: ReactNode;
	error?: string;
	progressPercent?: number;
};

export function ReadingProgressSection({
	children,
	error,
	progressPercent,
}: ReadingProgressSectionProps) {
	return (
		<div className="space-y-3 rounded-lg border border-border/70 bg-card p-4 shadow-soft">
			<p className="section-label">Reading progress</p>
			{children}
			{error && <p className="text-xs text-destructive">{error}</p>}
			{progressPercent !== undefined && (
				<div className="flex w-full items-center gap-2">
					<Progress
						aria-label={`Reading progress ${progressPercent}%`}
						className="min-w-0 flex-1 gap-0 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-secondary"
						value={progressPercent}
					/>
					<span className="shrink-0 text-[10px] font-semibold text-muted-foreground tabular-nums">
						{progressPercent}%
					</span>
				</div>
			)}
		</div>
	);
}
