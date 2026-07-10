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
				"group flex w-full items-center gap-4 rounded-lg px-3 py-3 text-left transition-all duration-200 hover:bg-canvas-soft/60 lg:gap-6 lg:px-4 lg:py-4",
				onClick && "cursor-pointer",
			)}
			onClick={onClick}
			type="button"
		>
			<div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-hairline lg:h-32 lg:w-24">
				{media.imageUrl && !imageFailed ? (
					<Image
						alt={media.name}
						className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
						height={128}
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
				<h4 className="line-clamp-2 font-heading text-sm font-medium leading-tight text-ink transition-colors group-hover:text-ink lg:line-clamp-3 lg:text-base">
					{media.name}
				</h4>
				{media.secondaryText && (
					<p className="mt-1 line-clamp-1 text-xs text-muted-foreground lg:mt-2 lg:text-sm">
						{media.secondaryText}
					</p>
				)}
				{media.releaseYear && (
					<p className="mt-1 text-xs text-muted-foreground tabular-nums lg:mt-2 lg:text-sm">
						{media.releaseYear}
					</p>
				)}

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
