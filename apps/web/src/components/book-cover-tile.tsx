import { CheckIcon } from "@phosphor-icons/react";
import { Image as UnpicImage } from "@unpic/react";
import { CoverGridTile } from "@/components/cover-grid-parts";
import { cn } from "@/lib/utils";

function BookCoverTile({
	caption,
	src,
	value,
}: {
	caption: string;
	src: string | null;
	value: string;
}) {
	return (
		<CoverGridTile
			aria-label={caption}
			className="group/tile flex cursor-pointer flex-col gap-2 rounded-lg text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover focus-visible:outline-none"
			value={value}
		>
			{({ selected }: { selected: boolean }) => (
				<div
					className={cn(
						"relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-secondary",
						selected
							? "ring-2 ring-primary ring-offset-2 ring-offset-popover"
							: "ring-1 ring-border group-hover/tile:ring-2 group-hover/tile:ring-ring/40",
					)}
				>
					{src ? (
						<UnpicImage
							alt={caption}
							className="h-full w-full object-cover"
							height={144}
							src={src}
							width={96}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center">
							<span className="text-xs text-muted-foreground/50">
								?
							</span>
						</div>
					)}

					{selected && (
						<span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
							<CheckIcon className="size-2.5" weight="bold" />
						</span>
					)}
				</div>
			)}
		</CoverGridTile>
	);
}

export default BookCoverTile;
