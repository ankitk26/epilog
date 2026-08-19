import { Image } from "@unpic/react";
import { useState } from "react";
import { shouldShowReleaseYear } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import BookProgress, { type BookProgressData } from "./book-progress";
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
		seriesKey?: string;
	};
	displayOnly?: boolean;
	onClick?: () => void;
	progress?: BookProgressData | null;
};

export default function MediaPosterCard(props: Props) {
	const { displayOnly = false } = props;
	const [imageFailed, setImageFailed] = useState(false);

	const isClickable = displayOnly && !!props.onClick;

	return (
		<div
			className={cn(
				"flex h-full w-full flex-col",
				isClickable && "cursor-pointer",
			)}
			onClick={props.onClick}
			role={isClickable ? "button" : undefined}
		>
			<div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-secondary shadow-soft ring-1 ring-border/70">
				{props.media.imageUrl && !imageFailed ? (
					<Image
						alt={props.media.name}
						className="h-full w-full object-cover object-top"
						height={396}
						onError={() => setImageFailed(true)}
						src={props.media.imageUrl}
						width={264}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-secondary">
						<MediaTypeIcon
							className="size-12 text-muted-foreground/40"
							type={props.media.type}
						/>
					</div>
				)}
			</div>
			<div className="flex flex-1 flex-col gap-2 pt-3">
				<h4 className="line-clamp-2 font-heading text-sm leading-snug font-medium text-foreground">
					{props.media.name}
				</h4>
				{shouldShowReleaseYear(props.media.type) &&
					props.media.releaseYear != null && (
						<p className="line-clamp-1 text-xs text-muted-foreground tabular-nums">
							{props.media.releaseYear}
						</p>
					)}
				{props.media.creator && (
					<p className="line-clamp-1 text-xs text-muted-foreground">
						{props.media.creator}
					</p>
				)}
				{props.media.type === "book" && (
					<div className="mt-auto min-h-6">
						{props.progress && (
							<BookProgress
								className="max-w-none pt-1"
								progress={props.progress}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
