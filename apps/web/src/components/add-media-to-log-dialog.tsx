import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTmdbMediaCreator } from "@/actions/get-tmdb-media-creator";
import MediaLogDialog, {
	type MediaLogDialogValues,
} from "@/components/media-log-dialog";
import type { MediaType } from "@/types";

type Media = {
	imageUrl: string | undefined | null;
	name: string;
	releaseYear: number | null;
	sourceId: string;
	type: MediaType;
	creator?: string | null;
	bookAuthorId?: string | null;
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

			toast.success("Added to library");
			onOpenChange(false);
		},
		onError: () => {
			toast.error("Something went wrong!");
		},
	});

	const creator = media?.creator ?? tmdbCreatorQuery.data;

	const handleAdd = (values: MediaLogDialogValues) => {
		if (!media || !values.status) return;

		addMutation.mutate({
			media: {
				name: media.name,
				releaseYear: media.releaseYear,
				sourceMediaId: media.sourceId,
				type: media.type,
				image: media.imageUrl ?? "",
				creator: media.creator ?? tmdbCreatorQuery.data ?? null,
				// the uniform SearchMedia contract uses null for empty optional
				// fields; the convex validators only accept undefined here.
				bookAuthorId: media.bookAuthorId ?? undefined,
				seriesName: media.seriesName ?? undefined,
				seriesPosition: media.seriesPosition ?? undefined,
				seriesTotal: media.seriesTotal ?? undefined,
				seriesKey: media.seriesKey ?? undefined,
			},
			status: values.status,
			...(values.pageCount !== undefined && {
				pageCount: values.pageCount,
			}),
			...(values.pagesRead !== undefined && {
				pagesRead: values.pagesRead,
			}),
		});
	};

	if (!media) return null;

	return (
		<MediaLogDialog
			initialPagesRead={0}
			media={{
				creator,
				imageUrl: media.imageUrl,
				name: media.name,
				releaseYear: media.releaseYear,
				type: mediaType,
			}}
			mode="add"
			onOpenChange={onOpenChange}
			onSubmit={handleAdd}
			open={open}
			submitLabel="Add to library"
			submittingLabel="Adding…"
			isSubmitting={addMutation.isPending}
		/>
	);
}
