import { CheckIcon } from "@phosphor-icons/react";
import { Image as UnpicImage } from "@unpic/react";
import { cn } from "@/lib/utils";

function BookCoverTile({
	caption,
	isSelected,
	onSelect,
	src,
}: {
	caption: string;
	isSelected: boolean;
	onSelect: () => void;
	src: string | null;
}) {
	return (
		<button
			aria-pressed={isSelected}
			className="group/tile flex cursor-pointer flex-col gap-1.5 text-left"
			onClick={onSelect}
			type="button"
		>
			<div
				className={cn(
					"relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-secondary transition-all duration-200",
					isSelected
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

				{isSelected && (
					<span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
						<CheckIcon className="size-2.5" weight="bold" />
					</span>
				)}
			</div>
		</button>
	);
}

export default BookCoverTile;
