import { Image } from "@unpic/react";
import { useState, type ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { shouldShowReleaseYear } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

export type LogItemMedia = {
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	creator?: string | null;
	type: MediaType;
};

export type LogItemProgress = {
	percent: number;
};

type LogItemProps = {
	media: LogItemMedia;
	onClick?: () => void;
	progress?: LogItemProgress | null;
};

type RootProps = {
	children: ReactNode;
	className: string;
	onClick?: () => void;
};

function Root({ children, className, onClick }: RootProps) {
	return (
		<div
			className={cn(
				className,
				onClick &&
					"cursor-pointer focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
			)}
			onClick={onClick}
			role={onClick ? "button" : undefined}
		>
			{children}
		</div>
	);
}

type PosterProps = {
	fallbackIconClassName: string;
	media: LogItemMedia;
	posterClassName: string;
	size: { height: number; width: number };
};

function Poster({
	fallbackIconClassName,
	media,
	posterClassName,
	size,
}: PosterProps) {
	const [imageFailed, setImageFailed] = useState(false);

	return (
		<div className={posterClassName}>
			{media.imageUrl && !imageFailed ? (
				<Image
					alt={media.name}
					className="h-full w-full object-cover object-top"
					height={size.height}
					onError={() => setImageFailed(true)}
					src={media.imageUrl}
					width={size.width}
				/>
			) : (
				<div className="flex h-full w-full items-center justify-center bg-secondary">
					<MediaTypeIcon
						className={fallbackIconClassName}
						type={media.type}
					/>
				</div>
			)}
		</div>
	);
}

type DetailsProps = {
	children?: ReactNode;
	className: string;
	media: LogItemMedia;
	titleClassName: string;
};

function Details({ children, className, media, titleClassName }: DetailsProps) {
	return (
		<div className={className}>
			<h4 className={titleClassName}>{media.name}</h4>
			{shouldShowReleaseYear(media.type) && media.releaseYear != null && (
				<p className="line-clamp-1 text-xs text-muted-foreground tabular-nums">
					{media.releaseYear}
				</p>
			)}
			{media.creator && (
				<p className="line-clamp-1 text-xs text-muted-foreground">
					{media.creator}
				</p>
			)}
			{children}
		</div>
	);
}

function Grid({ media, onClick, progress }: LogItemProps) {
	return (
		<Root className="flex h-full w-full flex-col" onClick={onClick}>
			<Poster
				fallbackIconClassName="size-12 text-muted-foreground/40"
				media={media}
				posterClassName="relative aspect-[2/3] overflow-hidden rounded-lg bg-secondary shadow-soft ring-1 ring-border/70"
				size={{ height: 396, width: 264 }}
			/>
			<Details
				className="flex flex-1 flex-col gap-2 pt-3"
				media={media}
				titleClassName="line-clamp-2 font-heading text-sm leading-snug font-medium text-foreground"
			>
				{media.type === "book" && (
					<div className="mt-auto flex min-h-6 items-center gap-2 pt-1">
						{progress && (
							<>
								<Progress
									aria-label={`Reading progress ${progress.percent}%`}
									className="min-w-0 flex-1 gap-0 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-secondary"
									value={progress.percent}
								/>
								<span className="shrink-0 text-[10px] font-semibold text-muted-foreground tabular-nums">
									{progress.percent}%
								</span>
							</>
						)}
					</div>
				)}
			</Details>
		</Root>
	);
}

function List({ media, onClick, progress }: LogItemProps) {
	return (
		<Root className="flex items-center gap-6" onClick={onClick}>
			<Poster
				fallbackIconClassName="size-5 text-muted-foreground/40"
				media={media}
				posterClassName="aspect-[2/3] w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-soft ring-1 ring-border/70"
				size={{ height: 132, width: 88 }}
			/>
			<Details
				className="flex min-w-0 flex-1 flex-col gap-3"
				media={media}
				titleClassName="font-heading text-sm leading-tight font-medium tracking-tight text-foreground"
			>
				{progress && (
					<div className="flex max-w-48 items-center gap-2">
						<Progress
							aria-label={`Reading progress ${progress.percent}%`}
							className="min-w-0 flex-1 gap-0 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-secondary"
							value={progress.percent}
						/>
						<span className="shrink-0 text-[10px] font-semibold text-muted-foreground tabular-nums">
							{progress.percent}%
						</span>
					</div>
				)}
			</Details>
		</Root>
	);
}

function Shelf({ media, onClick, progress }: LogItemProps) {
	return (
		<Root className="flex flex-col overflow-hidden" onClick={onClick}>
			<Poster
				fallbackIconClassName="size-4 text-muted-foreground/40"
				media={media}
				posterClassName="relative aspect-[2/3] w-1/2 self-center overflow-hidden rounded-lg bg-secondary shadow-soft ring-1 ring-border/70"
				size={{ height: 96, width: 64 }}
			/>
			<Details
				className="flex min-w-0 flex-1 flex-col items-center gap-1 pt-3 text-center"
				media={media}
				titleClassName="line-clamp-2 font-heading text-sm leading-tight font-medium text-foreground"
			>
				{progress && (
					<div className="flex w-full items-center gap-2 pt-1">
						<Progress
							aria-label={`Reading progress ${progress.percent}%`}
							className="min-w-0 flex-1 gap-0 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-secondary"
							value={progress.percent}
						/>
						<span className="shrink-0 text-[10px] font-semibold text-muted-foreground tabular-nums">
							{progress.percent}%
						</span>
					</div>
				)}
			</Details>
		</Root>
	);
}

const LogItem = { Grid, List, Shelf };

export default LogItem;
export { Grid as LogItemGrid, List as LogItemList, Shelf as LogItemShelf };
