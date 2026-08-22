import { CheckCircleIcon } from "@phosphor-icons/react";
import { Image } from "@unpic/react";
import { useState, type ReactNode } from "react";
import { Progress } from "@/components/ui/progress";
import { shouldShowReleaseYear } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

export type MediaCardMedia = {
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	creator?: string | null;
	secondaryText?: string | null;
	seriesName?: string;
	seriesPosition?: number;
	seriesTotal?: number;
	type: MediaType;
};

export type MediaCardProgressData = {
	percent: number;
};

type MediaCardLayoutProps = {
	children?: ReactNode;
	footer?: ReactNode;
	media: MediaCardMedia;
	onClick?: () => void;
};

function Root({
	children,
	className,
	onClick,
}: {
	children: ReactNode;
	className: string;
	onClick?: () => void;
}) {
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

function Poster({
	fallbackIconClassName,
	media,
	className,
	size,
}: {
	fallbackIconClassName: string;
	media: MediaCardMedia;
	className: string;
	size: { height: number; width: number };
}) {
	const [imageFailed, setImageFailed] = useState(false);

	return (
		<div className={className}>
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

function Title({
	className,
	media,
}: {
	className: string;
	media: MediaCardMedia;
}) {
	return <h4 className={className}>{media.name || "Untitled"}</h4>;
}

function Secondary({ media }: { media: MediaCardMedia }) {
	const text = media.secondaryText ?? media.creator;
	if (!text) return null;

	return <p className="line-clamp-1 text-xs text-muted-foreground">{text}</p>;
}

function ReleaseYear({ media }: { media: MediaCardMedia }) {
	if (!shouldShowReleaseYear(media.type) || media.releaseYear == null) {
		return null;
	}

	return (
		<p className="line-clamp-1 text-xs text-muted-foreground tabular-nums">
			{media.releaseYear}
		</p>
	);
}

function Series({ media }: { media: MediaCardMedia }) {
	if (!media.seriesName) return null;

	return (
		<p className="line-clamp-1 text-xs text-muted-foreground">
			{media.seriesPosition != null
				? `Book ${media.seriesPosition} in ${media.seriesName}`
				: media.seriesName}
		</p>
	);
}

function Footer({ children }: { children?: ReactNode }) {
	return <div className="mt-auto min-h-6">{children}</div>;
}

function ProgressMeter({ progress }: { progress: MediaCardProgressData }) {
	return (
		<div className="flex items-center gap-2">
			<Progress
				aria-label={`Reading progress ${progress.percent}%`}
				className="min-w-0 flex-1 gap-0 [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-secondary"
				value={progress.percent}
			/>
			<span className="shrink-0 text-[10px] font-semibold text-muted-foreground tabular-nums">
				{progress.percent}%
			</span>
		</div>
	);
}

function ProgressFooter({
	progress,
}: {
	progress?: MediaCardProgressData | null;
}) {
	if (!progress) return null;

	return (
		<Footer>
			<ProgressMeter progress={progress} />
		</Footer>
	);
}

function LoggedBadge() {
	return (
		<span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
			<CheckCircleIcon className="size-3" weight="fill" />
			In library
		</span>
	);
}

function Grid({ children, footer, media, onClick }: MediaCardLayoutProps) {
	return (
		<Root className="flex h-full w-full flex-col" onClick={onClick}>
			<Poster
				fallbackIconClassName="size-12 text-muted-foreground/40"
				media={media}
				className="relative aspect-[2/3] overflow-hidden rounded-lg bg-secondary shadow-sm ring-1 ring-border/70"
				size={{ height: 396, width: 264 }}
			/>
			<div className="flex flex-1 flex-col gap-2 pt-3">
				<Title
					className="line-clamp-2 text-sm leading-snug font-medium text-foreground"
					media={media}
				/>
				<Secondary media={media} />
				<ReleaseYear media={media} />
				{children}
				{footer}
			</div>
		</Root>
	);
}

function List({ children, footer, media, onClick }: MediaCardLayoutProps) {
	return (
		<Root className="flex items-center gap-6" onClick={onClick}>
			<Poster
				fallbackIconClassName="size-5 text-muted-foreground/40"
				media={media}
				className="aspect-[2/3] w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-sm ring-1 ring-border/70"
				size={{ height: 132, width: 88 }}
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-3">
				<Title
					className="text-sm leading-tight font-medium tracking-tight text-foreground"
					media={media}
				/>
				<Secondary media={media} />
				<ReleaseYear media={media} />
				{children}
				{footer}
			</div>
		</Root>
	);
}

function Shelf({ children, footer, media, onClick }: MediaCardLayoutProps) {
	return (
		<Root className="flex flex-col overflow-hidden" onClick={onClick}>
			<Poster
				fallbackIconClassName="size-4 text-muted-foreground/40"
				media={media}
				className="relative aspect-[2/3] w-1/2 self-center overflow-hidden rounded-lg bg-secondary shadow-sm ring-1 ring-border/70"
				size={{ height: 96, width: 64 }}
			/>
			<div className="flex min-w-0 flex-1 flex-col items-center gap-1 pt-3 text-center">
				<Title
					className="line-clamp-2 text-sm leading-tight font-medium text-foreground"
					media={media}
				/>
				<Secondary media={media} />
				<ReleaseYear media={media} />
				{children}
				{footer}
			</div>
		</Root>
	);
}

const MediaCard = {
	Footer,
	Grid,
	List,
	LoggedBadge,
	Progress: ProgressMeter,
	ProgressFooter,
	Series,
	Shelf,
};

export default MediaCard;
export {
	Footer as MediaCardFooter,
	Grid as MediaCardGrid,
	List as MediaCardList,
	LoggedBadge as MediaCardLoggedBadge,
	ProgressFooter as MediaCardProgressFooter,
	ProgressMeter as MediaCardProgress,
	Series as MediaCardSeries,
	Shelf as MediaCardShelf,
};
