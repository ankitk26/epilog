import { Image } from "@unpic/react";
import { getFullImageFromPosterPath } from "@/lib/get-full-image-from-poster-path";
import { getReleaseYear } from "@/lib/get-movie-release-year";
import IconByType from "./icon-by-type";

type Props = {
	movie: {
		id: number;
		poster_path: string | null;
		first_air_date?: string | null | undefined;
		release_date?: string | null | undefined;
		name?: string | null | undefined;
		title?: string | null | undefined;
		original_language?: string | null | undefined;
	};
	onClick?: (movie: Props["movie"]) => void;
};

export default function MovieSearchResultItem({ movie, onClick }: Props) {
	const releaseYear = getReleaseYear(
		movie.release_date,
		movie.first_air_date,
	);

	const posterImage = getFullImageFromPosterPath(movie.poster_path);

	return (
		<button
			type="button"
			className="flex w-full items-start gap-2 rounded-lg border p-2 text-left transition-colors hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
			onClick={() => onClick?.(movie)}
		>
			<div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden">
				{posterImage ? (
					<Image
						src={posterImage}
						className="h-full w-full rounded-lg object-cover object-top"
						height={120}
						width={80}
						alt={movie.name ?? "movie"}
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-muted">
						<IconByType
							className="size-6 text-muted-foreground"
							type="movie"
						/>
					</div>
				)}
			</div>
			<div className="min-w-0 flex-1">
				<h4 className="truncate text-xs font-medium">
					{movie.name ?? movie.title ?? "N/A"}
				</h4>
				{releaseYear && (
					<p className="text-xs text-muted-foreground">
						{releaseYear}
					</p>
				)}
			</div>
		</button>
	);
}
