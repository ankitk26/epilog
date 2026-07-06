import { Image } from "@unpic/react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";
import { Card, CardContent } from "./ui/card";

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
};

export default function MediaPosterCard(props: Props) {
	const { displayOnly = false } = props;
	const [imageFailed, setImageFailed] = useState(false);

	const isClickable = displayOnly && !!props.onClick;

	return (
		<Card
			className={cn(
				"group w-full overflow-hidden rounded-xl p-0 ring-1 ring-border transition-all duration-300",
				isClickable &&
					"cursor-pointer hover:-translate-y-1 hover:shadow-lift hover:ring-hairline-strong",
			)}
			onClick={props.onClick}
			role={isClickable ? "button" : undefined}
		>
			<div className="relative aspect-[2/3] overflow-hidden rounded-t-xl bg-muted">
				{props.media.imageUrl && !imageFailed ? (
					<Image
						alt={props.media.name}
						className={cn(
							"h-full w-full object-cover object-top transition-transform duration-700 ease-out",
							!displayOnly && "group-hover:scale-[1.04]",
						)}
						height={176}
						onError={() => setImageFailed(true)}
						src={props.media.imageUrl}
						width={264}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-secondary">
						<MediaTypeIcon
							className="size-14 text-muted-foreground/50"
							type={props.media.type}
						/>
					</div>
				)}
			</div>
			<CardContent className="space-y-2 px-3 py-4">
				<h4 className="line-clamp-2 font-heading text-sm leading-tight font-normal text-ink">
					{props.media.name}
				</h4>
				{props.media.secondaryText && (
					<p className="line-clamp-1 text-xs text-muted-foreground">
						{props.media.secondaryText}
					</p>
				)}
				{(props.media.creator ?? props.media.releaseYear) && (
					<p className="line-clamp-1 text-xs text-muted-foreground">
						{props.media.creator ?? props.media.releaseYear}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
