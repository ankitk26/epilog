import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { SpinnerIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import { useState } from "react";
import { toast } from "sonner";
import { getTmdbMediaCreator } from "@/actions/get-tmdb-media-creator";
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

	const [isAdding, setIsAdding] = useState(false);
	const addMovieEventMutation = useMutation({
		mutationFn: useConvexMutation(api.movieEvents.add),
	});

	const handleMovieClick = async () => {
		if (isAdding) return;

		setIsAdding(true);
		try {
			const formattedDate = `${year.toString().padStart(4, "0")}${(
				month + 1
			)
				.toString()
				.padStart(2, "0")}${day.toString().padStart(2, "0")}`;

			const sourceMediaId = buildSourceMediaId("movie", movie.id);
			const creator = await getTmdbMediaCreator({
				data: { sourceMediaId, type: "movie" },
			});

			const response = await addMovieEventMutation.mutateAsync({
				eventDate: formattedDate,
				media: {
					name: movie.name ?? movie.title ?? "N/A",
					releaseYear,
					creator,
					sourceMediaId,
					image: posterImage,
				},
			});

			if (response === "Already added") {
				toast.error("Movie already added for this day");
				return;
			}

			closeDialog();
		} catch {
			toast.error("Something went wrong!");
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<button
			type="button"
			className="flex w-full items-start gap-3 rounded-lg border border-border/70 bg-card p-3 text-left shadow-soft transition-all duration-200 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none fine-hover:hover:shadow-lift"
			disabled={isAdding}
			onClick={handleMovieClick}
		>
			<div className="relative aspect-[2/3] w-10 shrink-0 overflow-hidden rounded-md bg-secondary">
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
				<div className="flex items-center gap-2">
					{isAdding && (
						<SpinnerIcon className="size-3.5 animate-spin text-muted-foreground" />
					)}
					<h4 className="truncate font-heading text-sm font-normal text-foreground">
						{movie.name ?? movie.title ?? "N/A"}
					</h4>
				</div>
				{releaseYear && (
					<p className="mt-1 text-xs text-muted-foreground tabular-nums">
						{releaseYear}
					</p>
				)}
			</div>
		</button>
	);
}
