import { CheckCircleIcon } from "@phosphor-icons/react";
import { Image } from "@unpic/react";
import { useState } from "react";
import { shouldShowReleaseYear } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

type Props = {
	media: {
		imageUrl: string | undefined | null;
		name: string;
		secondaryText?: string | null;
		releaseYear: number | null;
		creator?: string | null;
		sourceId: string;
		type: MediaType;
		seriesName?: string;
		seriesPosition?: number;
		seriesTotal?: number;
	};
	isLogged?: boolean;
	onClick?: () => void;
};

export default function SearchMediaListItem({
	media,
	isLogged,
	onClick,
}: Props) {
	const [imageFailed, setImageFailed] = useState(false);
	const secondaryText = media.secondaryText ?? media.creator;
	const poster =
		media.imageUrl && !imageFailed ? (
			<Image
				alt={media.name}
				className="h-full w-full object-cover object-top"
				height={396}
				onError={() => setImageFailed(true)}
				src={media.imageUrl}
				width={264}
			/>
		) : (
			<div className="flex h-full w-full items-center justify-center">
				<MediaTypeIcon
					className="size-5 text-muted-foreground/40 lg:size-10"
					type={media.type}
				/>
			</div>
		);

	return (
		<>
			<button
				className={cn(
					"group flex w-full items-center gap-4 rounded-xl border border-border/70 bg-card px-3 py-3 text-left shadow-soft transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none lg:hidden fine-hover:hover:shadow-lift",
					onClick && "cursor-pointer",
				)}
				onClick={onClick}
				type="button"
			>
				<div className="aspect-[2/3] w-16 flex-shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-border">
					{poster}
				</div>

				<div className="min-w-0 flex-1">
					<h4 className="line-clamp-2 font-heading text-sm leading-tight font-medium text-foreground transition-colors fine-hover:group-hover:text-foreground">
						{media.name}
					</h4>
					{secondaryText && (
						<p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
							{secondaryText}
						</p>
					)}
					<div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
						{shouldShowReleaseYear(media.type) &&
							media.releaseYear != null && (
								<span className="tabular-nums">
									{media.releaseYear}
								</span>
							)}
						{shouldShowReleaseYear(media.type) &&
							media.releaseYear != null &&
							media.seriesName && (
								<span className="text-border">•</span>
							)}
						{media.seriesName && (
							<span className="line-clamp-1">
								{media.seriesPosition != null
									? `Book ${media.seriesPosition}`
									: media.seriesName}
								{media.seriesTotal != null &&
									media.seriesPosition != null &&
									` of ${media.seriesTotal}`}
								{media.seriesPosition != null &&
									` in ${media.seriesName}`}
							</span>
						)}
					</div>

					{isLogged && (
						<span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
							<CheckCircleIcon className="size-3" weight="fill" />
							In library
						</span>
					)}
				</div>
			</button>

			<button
				className={cn(
					"group hidden w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-3 text-left shadow-soft transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none lg:flex fine-hover:hover:shadow-lift fine-hover:hover:ring-2 fine-hover:hover:ring-border",
					onClick && "cursor-pointer",
				)}
				onClick={onClick}
				type="button"
			>
				<div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-secondary ring-1 ring-border">
					{poster}
				</div>
				<div className="min-w-0 pt-3">
					<h4 className="line-clamp-2 font-heading text-sm leading-snug font-medium text-foreground">
						{media.name}
					</h4>
					{(shouldShowReleaseYear(media.type) || secondaryText) && (
						<div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
							{shouldShowReleaseYear(media.type) &&
								media.releaseYear != null && (
									<span className="shrink-0 tabular-nums">
										{media.releaseYear}
									</span>
								)}
							{secondaryText && (
								<span className="truncate">
									{secondaryText}
								</span>
							)}
						</div>
					)}
					{media.seriesName && (
						<p className="mt-2 truncate text-xs text-muted-foreground">
							{media.seriesPosition != null
								? `Book ${media.seriesPosition} in ${media.seriesName}`
								: media.seriesName}
						</p>
					)}
					{isLogged && (
						<span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">
							<CheckCircleIcon className="size-3" weight="fill" />
							In library
						</span>
					)}
				</div>
			</button>
		</>
	);
}
