import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { statusLabel } from "@/lib/media-labels";
import { cn } from "@/lib/utils";
import { statusesByMediaType } from "@/types";
import type { LogStatus, MediaType } from "@/types";
import MediaTypeIcon from "./media-type-icon";

type Media = {
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	sourceId: string;
	type: MediaType;
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

function formatMediaType(type: MediaType) {
	switch (type) {
		case "tv":
			return "TV";
		default:
			return type.charAt(0).toUpperCase() + type.slice(1);
	}
}

export default function AddMediaToLogDialog({
	media,
	open,
	onOpenChange,
}: Props) {
	const mediaType = media?.type ?? "movie";
	const validStatuses = statusesByMediaType[mediaType];
	const [status, setStatus] = useState<LogStatus | null>(null);

	const titleRef = useRef<HTMLHeadingElement>(null);

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
				seriesName: media.seriesName,
				seriesPosition: media.seriesPosition,
				seriesTotal: media.seriesTotal,
				seriesKey: media.seriesKey,
			},
			status,
		});
	};

	const isLoading = addMutation.isPending;
	const seriesLabel = (() => {
		if (!media?.seriesName) return null;
		if (media.seriesPosition) {
			return `(${media.seriesName}, #${media.seriesPosition})`;
		}
		return `(${media.seriesName})`;
	})();

	return (
		<Dialog
			open={open}
			onOpenChange={(value) => {
				if (!value) setStatus(null);
				onOpenChange(value);
			}}
		>
			<DialogContent
				className="top-auto right-0 bottom-0 left-0 flex max-h-[85vh] max-w-full translate-x-0 translate-y-0 flex-col overflow-hidden rounded-t-2xl rounded-b-none border border-b-0 border-hairline p-6 shadow-lift sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl sm:border-b sm:p-6"
				initialFocus={titleRef}
			>
				<DialogHeader className="relative z-10 flex-shrink-0">
					<DialogTitle
						ref={titleRef}
						className="font-heading text-xl leading-tight font-normal tracking-tight text-ink"
						tabIndex={-1}
					>
						{media?.name || "Untitled"}
					</DialogTitle>
				</DialogHeader>

				{media && (
					<div className="relative z-10 flex flex-col gap-6 overflow-y-auto">
						{/* Media summary */}
						<div className="flex gap-4">
							<div className="h-[140px] w-24 flex-shrink-0 overflow-hidden rounded-lg bg-secondary shadow-soft ring-1 ring-hairline sm:h-[120px] sm:w-20">
								{media.imageUrl ? (
									<Image
										alt={media.name || "Media poster"}
										className="h-full w-full object-cover"
										height={120}
										src={media.imageUrl}
										width={80}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<MediaTypeIcon
											className="size-5 text-muted-foreground/50"
											type={media.type}
										/>
									</div>
								)}
							</div>

							<div className="min-w-0 flex-1 space-y-2 pt-1">
								<p className="text-sm font-medium text-ink">
									{formatMediaType(media.type)}
									{media.releaseYear ? (
										<span className="text-muted-foreground tabular-nums">
											{" · "}
											{media.releaseYear}
										</span>
									) : null}
								</p>

								{seriesLabel && (
									<p className="text-xs text-muted-foreground">
										{seriesLabel}
									</p>
								)}
							</div>
						</div>

						{/* Status field */}
						<div className="space-y-3">
							<label className="eyebrow block">Status</label>
							<div className="flex flex-col gap-2">
								{validStatuses.map((s) => {
									const isActive = status === s;
									return (
										<button
											className={cn(
												"h-11 w-full cursor-pointer rounded-full border px-3 text-sm font-medium tracking-wide transition-all duration-200 disabled:opacity-50 sm:h-9",
												isActive
													? "border-transparent bg-primary text-primary-foreground shadow-soft"
													: "border-hairline-strong bg-transparent text-muted-foreground hover:border-ink/30 hover:text-ink",
											)}
											disabled={isLoading}
											key={s}
											onClick={() => setStatus(s)}
											type="button"
										>
											{statusLabel(s, mediaType)}
										</button>
									);
								})}
							</div>
						</div>

						{/* Footer actions */}
						<div className="flex flex-col gap-3 border-t border-hairline pt-4 sm:flex-row sm:items-center sm:justify-end">
							<Button
								className="h-11 w-full rounded-full border border-hairline-strong bg-transparent px-4 text-sm font-medium text-ink hover:bg-secondary sm:h-9 sm:w-auto"
								disabled={isLoading}
								onClick={() => onOpenChange(false)}
								size="sm"
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								className="h-11 w-full rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-soft transition-all hover:shadow-lift disabled:opacity-40 sm:h-9 sm:w-auto"
								disabled={isLoading || !status}
								onClick={handleAdd}
								size="sm"
							>
								Add to library
							</Button>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
