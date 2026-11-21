import { CaretLeftIcon, SpinnerIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getBookEditionCovers } from "@/actions/get-book-editions";
import BookCoverTile from "@/components/book-cover-tile";
import { CoverGrid } from "@/components/cover-grid-parts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// The grid's tile values are strings, so the default-cover option (no
// custom cover, selected is null) carries this sentinel.
const DEFAULT_COVER = "default";

type Props = {
	active: boolean;
	defaultImage: string | null | undefined;
	isApplying: boolean;
	onApply: (coverUrl: string | null) => void;
	onBack: () => void;
	value: string | null;
	workId: string;
};

export default function BookCoverPicker({
	active,
	defaultImage,
	isApplying,
	onApply,
	onBack,
	value,
	workId,
}: Props) {
	const [selected, setSelected] = useState<string | null>(value);

	const { data: editions, isPending } = useQuery({
		queryKey: ["book-editions", workId],
		queryFn: async () => {
			const results = await getBookEditionCovers({ data: { workId } });
			return results;
		},
		enabled: active,
		retry: false,
		staleTime: 1000 * 60 * 5,
	});

	const editionCount = editions?.length ?? 0;
	const hasSelectionChanged = selected !== value;
	const gridScrollRef = useRef<HTMLDivElement>(null);

	// The cover view mounts per open; once the editions have rendered,
	// put focus on the selected tile so arrows continue from there.
	useEffect(() => {
		if (isPending || !editions?.length) return;
		gridScrollRef.current
			?.querySelector<HTMLElement>("[aria-selected='true']")
			?.focus();
	}, [isPending, editions]);

	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<div className="flex flex-col items-start gap-2 px-4 pt-4 pb-3 sm:px-6">
				<Button
					className="-ml-2"
					disabled={isApplying}
					onClick={onBack}
					size="icon-sm"
					variant="ghost"
				>
					<CaretLeftIcon />
					<span className="sr-only">Back</span>
				</Button>

				{!isPending && editionCount > 0 && (
					<span className="text-foreground tabular-nums">
						{editionCount}{" "}
						{editionCount === 1 ? "edition" : "editions"}
					</span>
				)}
			</div>

			<div
				className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-4 sm:px-6"
				ref={gridScrollRef}
			>
				{isPending ? (
					<div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-6">
						{Array.from({ length: 8 }).map((_, index) => (
							<Skeleton
								key={`cover-skeleton-${index + 1}`}
								className="aspect-[2/3] w-full rounded-lg"
							/>
						))}
					</div>
				) : !editions || editionCount === 0 ? (
					<p className="py-8 text-center text-xs leading-relaxed text-muted-foreground">
						No other covers found for this book.
					</p>
				) : (
					<CoverGrid
						aria-label="Choose a cover"
						className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-5 lg:grid-cols-6"
						value={selected ?? DEFAULT_COVER}
						onValueChange={(next) =>
							setSelected(next === DEFAULT_COVER ? null : next)
						}
						onApply={(next) => {
							if (
								isApplying ||
								next === (value ?? DEFAULT_COVER)
							) {
								return;
							}
							onApply(next === DEFAULT_COVER ? null : next);
						}}
					>
						{/* Default cover option resets customImage to null */}
						<BookCoverTile
							caption="Default"
							src={defaultImage ?? null}
							value={DEFAULT_COVER}
						/>
						{editions
							.filter(
								(edition) =>
									edition.coverUrl !== null &&
									edition.coverUrl !== defaultImage,
							)
							.map((edition) => (
								<BookCoverTile
									caption={
										edition.publicationDate ??
										edition.title ??
										"Edition"
									}
									key={edition.id}
									src={edition.coverUrl}
									value={edition.coverUrl}
								/>
							))}
					</CoverGrid>
				)}
			</div>

			<div className="px-4 pt-4 pb-4 sm:px-6 sm:pb-6">
				<Button
					className="w-full"
					disabled={
						isApplying ||
						isPending ||
						!editions ||
						editionCount === 0 ||
						!hasSelectionChanged
					}
					onClick={() => onApply(selected)}
				>
					{isApplying ? (
						<>
							<SpinnerIcon className="size-4 animate-spin" />
							Updating…
						</>
					) : (
						"Update cover"
					)}
				</Button>
			</div>
		</div>
	);
}
