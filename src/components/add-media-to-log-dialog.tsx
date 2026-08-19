import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { getTmdbMediaCreator } from "@/actions/get-tmdb-media-creator";
import {
	BottomSheetDialogContent,
	Dialog,
} from "@/components/bottom-sheet-dialog";
import {
	ReadingProgressField,
	MediaLogDialogHero,
	MediaLogStatusPicker,
} from "@/components/media-log-dialog-parts";
import { Button } from "@/components/ui/button";
import type { LogStatus, MediaType } from "@/types";

type Media = {
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	sourceId: string;
	type: MediaType;
	creator?: string | null;
	seriesName?: string;
	seriesPosition?: number;
	seriesTotal?: number;
	seriesKey?: string;
};

type Props = {
	media: Media | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function parsePageCount(value: string): number | undefined {
	const digits = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
	if (digits === "") return undefined;
	return parseInt(digits, 10);
}

export default function AddMediaToLogDialog({
	media,
	open,
	onOpenChange,
}: Props) {
	const mediaType = media?.type ?? "movie";
	const [status, setStatus] = useState<LogStatus | null>(null);
	const [pageCount, setPageCount] = useState<number | undefined>(undefined);

	const tmdbCreatorQuery = useQuery({
		queryKey: ["tmdb-creator", media?.sourceId, media?.type],
		queryFn: async () => {
			if (!media || (media.type !== "movie" && media.type !== "tv")) {
				return null;
			}
			return await getTmdbMediaCreator({
				data: { sourceMediaId: media.sourceId, type: media.type },
			});
		},
		enabled: !!media && (media.type === "movie" || media.type === "tv"),
	});

	const addMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.add),
		onSuccess: (response: string) => {
			if (response === "Already added") {
				toast.error("This media is already in your library");
				return;
			}

			setStatus(null);
			setPageCount(undefined);
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Something went wrong!");
		},
	});

	const isLoading = addMutation.isPending;
	const creator = media?.creator ?? tmdbCreatorQuery.data;
	const isReadingBook = mediaType === "book" && status === "reading";
	const canAdd =
		!!status &&
		(!isReadingBook || (pageCount !== undefined && pageCount > 0));

	const handleAdd = () => {
		if (!media || !status) return;
		if (isReadingBook && (!pageCount || pageCount <= 0)) return;

		addMutation.mutate({
			media: {
				name: media.name,
				releaseYear: media.releaseYear,
				sourceMediaId: media.sourceId,
				type: media.type,
				image: media.imageUrl ?? "",
				creator: media.creator ?? tmdbCreatorQuery.data ?? null,
				seriesName: media.seriesName,
				seriesPosition: media.seriesPosition,
				seriesTotal: media.seriesTotal,
				seriesKey: media.seriesKey,
			},
			status,
			pageCount: isReadingBook ? pageCount : undefined,
			pagesRead: isReadingBook ? 0 : undefined,
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				if (!value) {
					setStatus(null);
					setPageCount(undefined);
				}
				onOpenChange(value);
			}}
		>
			<BottomSheetDialogContent showCloseButton initialFocus={false}>
				{media && (
					<div className="flex flex-col overflow-y-auto">
						<MediaLogDialogHero creator={creator} media={media} />

						<div className="flex flex-col gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
							<MediaLogStatusPicker
								disabled={isLoading}
								mediaType={mediaType}
								onChange={setStatus}
								value={status}
							/>

							{isReadingBook && (
								<div className="space-y-2">
									<ReadingProgressField
										id="book-page-count"
										label="Number of pages"
										onChange={(event) =>
											setPageCount(
												parsePageCount(
													event.target.value,
												),
											)
										}
										placeholder="300"
										value={pageCount}
									/>
								</div>
							)}

							<div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">
								<Button
									disabled={isLoading}
									onClick={() => onOpenChange(false)}
									variant="outline"
								>
									Cancel
								</Button>
								<Button
									disabled={isLoading || !canAdd}
									onClick={handleAdd}
								>
									{isLoading ? (
										<SpinnerIcon className="size-4 animate-spin" />
									) : (
										"Add to library"
									)}
								</Button>
							</div>
						</div>
					</div>
				)}
			</BottomSheetDialogContent>
		</Dialog>
	);
}
