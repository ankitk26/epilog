import { CheckCircleIcon } from "@phosphor-icons/react";
import { Image } from "@unpic/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

type Props = {
	media: {
		imageUrl: string | undefined | null;
		name: string;
		secondaryText?: string | null;
		releaseYear: number | null;
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

	return (
		<button
			className={cn(
				"group flex w-full items-center gap-4 rounded-xl border border-border/70 bg-card px-3 py-3 text-left shadow-soft transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none lg:gap-6 lg:py-4 lg:pr-4 fine-hover:hover:shadow-lift",
				onClick && "cursor-pointer",
			)}
			onClick={onClick}
			type="button"
		>
			<div className="aspect-[2/3] w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-border lg:w-24">
				{media.imageUrl && !imageFailed ? (
					<Image
						alt={media.name}
						className="h-full w-full object-cover"
						height={144}
						onError={() => setImageFailed(true)}
						src={media.imageUrl}
						width={96}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<MediaTypeIcon
							className="size-5 text-muted-foreground/40 lg:size-8"
							type={media.type}
						/>
					</div>
				)}
			</div>

			<div className="min-w-0 flex-1">
				<h4 className="line-clamp-2 font-heading text-sm leading-tight font-medium text-foreground transition-colors lg:line-clamp-3 lg:text-base fine-hover:group-hover:text-foreground">
					{media.name}
				</h4>
				{media.secondaryText && (
					<p className="mt-1 line-clamp-1 text-xs text-muted-foreground lg:mt-2 lg:text-sm">
						{media.secondaryText}
					</p>
				)}
				<div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-muted-foreground lg:mt-2 lg:text-sm">
					{media.releaseYear != null && (
						<span className="tabular-nums">
							{media.releaseYear}
						</span>
					)}
					{media.releaseYear != null && media.seriesName && (
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
					<span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary lg:mt-3 lg:text-sm">
						<CheckCircleIcon
							className="size-3 lg:size-3.5"
							weight="fill"
						/>
						In library
					</span>
				)}
			</div>
		</button>
	);
}
