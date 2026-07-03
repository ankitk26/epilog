import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { toast } from "sonner";
import { buildSourceMediaId } from "@/lib/build-source-media-id";
import { buildTmdbPosterImageUrl } from "@/lib/build-tmdb-poster-image-url";
import { getTmdbMediaReleaseYear } from "@/lib/get-tmdb-media-release-year";
import MediaTypeIcon from "./media-type-icon";

type Props = {
	movie: {
		id: number;
		poster_path?: string | null | undefined;
		first_air_date?: string | null | undefined;
		release_date?: string | null | undefined;
		name?: string | null | undefined;
		title?: string | null | undefined;
		original_language?: string | null | undefined;
	};
	day: number;
	month: number;
	year: number;
	closeDialog: () => void;
};

export default function MovieCalendarSearchResultRow({
	movie,
	day,
	month,
	year,
	closeDialog,
}: Props) {
	const releaseYear = getTmdbMediaReleaseYear(
		movie.release_date,
		movie.first_air_date,
	);

	const posterImage = buildTmdbPosterImageUrl(movie.poster_path);

	const addMovieEventMutation = useMutation({
		mutationFn: useConvexMutation(api.movieEvents.add),
		onMutate: () => {
			toast.loading("Adding movie event...");
		},
		onSuccess: (response: string) => {
			toast.dismiss();

			if (response === "Already added") {
				toast.error("Movie already added for this day");
				return;
			}

			closeDialog();
			toast.success(response);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	const handleMovieClick = () => {
		const formattedDate = `${year.toString().padStart(4, "0")}${(month + 1)
			.toString()
			.padStart(2, "0")}${day.toString().padStart(2, "0")}`;

		addMovieEventMutation.mutate({
			eventDate: formattedDate,
			media: {
				name: movie.name ?? movie.title ?? "N/A",
				releaseYear,
				sourceMediaId: buildSourceMediaId("movie", movie.id),
				image: posterImage,
			},
		});
	};

	return (
		<button
			type="button"
			className="flex w-full items-start gap-3 rounded-lg border border-hairline bg-card p-3 text-left transition-all duration-200 hover:shadow-soft focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			onClick={handleMovieClick}
		>
			<div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
				{posterImage ? (
					<Image
						src={posterImage}
						className="h-full w-full object-cover object-top"
						height={120}
						width={80}
						alt={movie.name ?? "movie"}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<MediaTypeIcon
							className="size-5 text-muted-foreground/50"
							type="movie"
						/>
					</div>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<h4 className="truncate font-heading text-sm font-normal text-ink">
					{movie.name ?? movie.title ?? "N/A"}
				</h4>
				{releaseYear && (
					<p className="mt-1 text-xs text-muted-foreground tabular-nums">
						{releaseYear}
					</p>
				)}
			</div>
		</button>
	);
}
