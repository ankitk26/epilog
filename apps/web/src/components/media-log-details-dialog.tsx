import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { ImagesIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import type { FunctionReturnType } from "convex/server";
import { useState } from "react";
import { toast } from "sonner";
import BookCoverPicker from "@/components/book-cover-picker";
import MediaLogDialog, {
	type MediaLogDialogValues,
} from "@/components/media-log-dialog";
import { Button } from "@/components/ui/button";
import { formatLogDate, statusPhrase } from "@/lib/media-labels";
import type { LogStatus } from "@/types";

type Log = FunctionReturnType<typeof api.logs.all>[0];

type Props = {
	log: Log | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function asLogStatus(status: string): LogStatus {
	// SAFETY: log statuses are constrained by the Convex schema.
	return status as LogStatus;
}

export default function MediaLogDetailsDialog({
	log,
	open,
	onOpenChange,
}: Props) {
	if (!log) return null;

	return (
		<MediaLogDetailsDialogContent
			key={log._id}
			log={log}
			open={open}
			onOpenChange={onOpenChange}
		/>
	);
}

function MediaLogDetailsDialogContent({
	log,
	open,
	onOpenChange,
}: {
	log: Log;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const mediaType = log.metadata.type;
	const [view, setView] = useState<"main" | "covers">("main");
	const [customImage, setCustomImage] = useState<string | null | undefined>(
		log.customImage ?? undefined,
	);

	const updateCoverMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.updateCover),
		onSuccess: () => {
			toast.success("Cover updated");
			setView("main");
		},
		onError: () => toast.error("Something went wrong!"),
	});

	const handleApplyCover = (coverUrl: string | null) => {
		setCustomImage(coverUrl);
		updateCoverMutation.mutate({ logId: log._id, customImage: coverUrl });
	};

	const updateMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.update),
		onSuccess: () => onOpenChange(false),
		onError: () => toast.error("Something went wrong!"),
	});

	const removeMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.remove),
		onSuccess: () => onOpenChange(false),
		onError: () => toast.error("Something went wrong!"),
	});

	const handleSave = (values: MediaLogDialogValues) => {
		if (!values.status) return;

		updateMutation.mutate({
			logId: log._id,
			status: values.status,
			...(values.pageCount !== undefined && {
				pageCount: values.pageCount,
			}),
			...(values.pagesRead !== undefined && {
				pagesRead: values.pagesRead,
			}),
		});
	};

	const handleDelete = () => {
		removeMutation.mutate({ logId: log._id });
	};

	const handleOpenChange = (next: boolean) => {
		// Leaving the cover picker resets the view for the next open.
		if (!next) setView("main");
		onOpenChange(next);
	};

	const isLoading = updateMutation.isPending || removeMutation.isPending;
	const posterUrl = customImage ?? log.customImage ?? log.metadata.image;
	const title = log.metadata.name || "Untitled";
	const creator = log.metadata.creator;
	const creatorHref =
		mediaType === "book" && log.metadata.bookAuthorId
			? log.metadata.bookAuthorId
			: null;
	const canChangeCover = mediaType === "book" && !!log.metadata.sourceMediaId;
	const statusNote = statusPhrase(
		asLogStatus(log.status),
		formatLogDate(log.updatedTime),
	);

	const coverPicker =
		view === "covers" && log.metadata.sourceMediaId ? (
			<div className="flex min-h-0 flex-1 flex-col">
				<BookCoverPicker
					active
					defaultImage={log.metadata.image}
					isApplying={updateCoverMutation.isPending}
					onApply={handleApplyCover}
					onBack={() => setView("main")}
					value={customImage ?? null}
					workId={log.metadata.sourceMediaId.split(":").pop() ?? ""}
				/>
			</div>
		) : undefined;

	return (
		<MediaLogDialog
			body={coverPicker}
			initialPageCount={log.pageCount ?? undefined}
			initialPagesRead={log.pagesRead ?? 0}
			initialStatus={asLogStatus(log.status)}
			isDeleting={removeMutation.isPending}
			isSubmitting={isLoading}
			media={{
				creator,
				creatorHref,
				imageUrl: posterUrl,
				name: title,
				releaseYear: log.metadata.releaseYear,
				type: mediaType,
			}}
			mode="edit"
			onDelete={handleDelete}
			onOpenChange={handleOpenChange}
			onSubmit={handleSave}
			open={open}
			posterAction={
				canChangeCover ? (
					<Button
						className="gap-1 text-xs"
						onClick={() => setView("covers")}
						size="sm"
						variant="secondary"
					>
						<ImagesIcon className="size-3.5" />
						Change cover
					</Button>
				) : undefined
			}
			statusNote={statusNote}
			submitLabel="Save"
			submittingLabel="Saving…"
		/>
	);
}
