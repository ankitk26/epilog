import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { useState } from "react";
import { toast } from "sonner";
import { getTmdbMediaCreator } from "@/actions/get-tmdb-media-creator";
import {
	BottomSheetDialogContent,
	Dialog,
} from "@/components/bottom-sheet-dialog";
import { Button } from "@/components/ui/button";
import { creatorPhrase } from "@/lib/creator-phrase";
import { getStatusIcon, statusLabel } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import { statusesByMediaType } from "@/types";
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

export default function AddMediaToLogDialog({
	media,
	open,
	onOpenChange,
}: Props) {
	const mediaType = media?.type ?? "movie";
	const validStatuses = statusesByMediaType[mediaType];
	const [status, setStatus] = useState<LogStatus | null>(null);

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
		onMutate: () => {
			toast.loading("Adding...");
		},
		onSuccess: (response: string) => {
			toast.dismiss();
			toast.success(response);
			setStatus(null);
			onOpenChange(false);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	const handleAdd = () => {
		if (!media || !status) return;
		addMutation.mutate({
			media: {
				name: media.name,
				releaseYear: media.releaseYear ?? 2025,
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
		});
	};

	const isLoading = addMutation.isPending;
	const creator = media?.creator ?? tmdbCreatorQuery.data;

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				if (!value) setStatus(null);
				onOpenChange(value);
			}}
		>
			<BottomSheetDialogContent showCloseButton initialFocus={false}>
				{media && (
					<div className="flex flex-col overflow-y-auto">
						{/* ── Hero: blurred ambient backdrop + poster card ── */}
						<div className="relative flex-shrink-0">
							{/* Blurred ambient backdrop */}
							{media.imageUrl ? (
								<div className="absolute inset-0 overflow-hidden">
									<img
										alt=""
										aria-hidden="true"
										className="h-full w-full scale-110 object-cover opacity-15 blur-2xl"
										src={media.imageUrl}
									/>
								</div>
							) : (
								<div className="absolute inset-0 bg-secondary" />
							)}

							{/* Gradient fade at bottom edge */}
							<div className="absolute inset-x-0 bottom-0 z-[1] h-16 bg-gradient-to-t from-popover to-transparent" />

							{/* Content: poster + info */}
							<div className="relative z-[2] flex gap-3 px-4 pt-6 pb-4 sm:gap-4 sm:px-6 sm:pt-8 sm:pb-6">
								{/* Vertical poster */}
								<div className="h-36 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-lift ring-1 ring-border sm:h-48 sm:w-36">
									{media.imageUrl ? (
										<Image
											alt={media.name || "Media poster"}
											className="h-full w-full object-cover"
											height={192}
											src={media.imageUrl}
											width={144}
										/>
									) : (
										<div className="flex h-full w-full items-center justify-center">
											<span className="font-heading text-3xl text-muted-foreground/20">
												{(media.name || "?")
													.charAt(0)
													.toUpperCase()}
											</span>
										</div>
									)}
								</div>

								{/* Title + metadata */}
								<div className="flex min-w-0 flex-1 flex-col justify-end pb-1">
									<h2 className="line-clamp-2 font-heading text-lg leading-tight font-medium tracking-tight text-foreground">
										{media.name || "Untitled"}
									</h2>

									<div className="mt-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
										{media.releaseYear && (
											<span className="tabular-nums">
												{media.releaseYear}
											</span>
										)}
									</div>

									{creator && (
										<p className="mt-1.5 text-xs font-medium text-foreground/70">
											{creatorPhrase(media.type, creator)}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* ── Body ── */}
						<div className="flex flex-col gap-4 px-4 pb-4 sm:gap-6 sm:px-6 sm:pb-6">
							{/* ── Status selector ── */}
							<div className="space-y-3">
								<div className="flex flex-col overflow-hidden rounded-lg border border-border">
									{validStatuses.map((s, index) => {
										const isActive = status === s;
										const StatusIcon = getStatusIcon(s);
										return (
											<button
												className={cn(
													"relative flex w-full cursor-pointer items-center gap-3 py-3 pr-4 pl-4 text-left text-sm transition-colors duration-150 disabled:opacity-50",
													index > 0 &&
														"border-t border-border",
													isActive
														? "bg-primary/[0.04]"
														: "hover:bg-secondary/60",
												)}
												disabled={isLoading}
												key={s}
												onClick={() => setStatus(s)}
												type="button"
											>
												<StatusIcon
													className={cn(
														"size-4 shrink-0 transition-colors duration-150",
														isActive
															? "text-primary"
															: "text-muted-foreground",
													)}
													weight={
														isActive
															? "fill"
															: "regular"
													}
												/>
												<span
													className={cn(
														"flex-1 font-medium transition-colors duration-150",
														isActive
															? "text-foreground"
															: "text-muted-foreground",
													)}
												>
													{statusLabel(s, mediaType)}
												</span>
											</button>
										);
									})}
								</div>
							</div>

							{/* ── Footer actions ── */}
							<div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">
								<Button
									disabled={isLoading}
									onClick={() => onOpenChange(false)}
									variant="outline"
								>
									Cancel
								</Button>
								<Button
									disabled={isLoading || !status}
									onClick={handleAdd}
								>
									Add to library
								</Button>
							</div>
						</div>
					</div>
				)}
			</BottomSheetDialogContent>
		</Dialog>
	);
}
