import { useQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { Image } from "@unpic/react";
import { FormEvent, useState } from "react";
import { getContentSearchResults } from "@/actions/get-content-search-results";
import { getReleaseYear } from "@/lib/get-movie-release-year";
import { cn } from "@/lib/utils";
import { searchStore } from "@/store/search-store";
import IconByType from "./icon-by-type";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
	label: number;
	day: number;
	month: number;
	year: number;
	isCurrentMonth?: boolean;
};

export default function CalendarDay({
	label,
	day,
	month,
	year,
	isCurrentMonth = false,
}: Props) {
	const [query, setQuery] = useState("");
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const {
		data: movieSearchResults,
		isPending,
		isEnabled,
	} = useQuery({
		queryKey: ["search", "media-content", "movie", query],
		queryFn: async () =>
			await getContentSearchResults({
				data: { searchQuery: query, mediaType: "movie" },
			}),
		enabled: query.length !== 0 && isFormSubmitted,
	});

	const today = new Date();

	const currentMonth = today.getMonth();
	const currentDay = today.getDate();
	const currentYear = today.getFullYear();

	const isDayToday =
		currentDay === day && currentMonth === month && currentYear === year;

	const addMovieEvent = () => {
		const actualMonth = month + 1;
		console.log(`Date = ${day}-${actualMonth}-${year}`);
	};

	function handleQuerySubmit(e: FormEvent) {
		e.preventDefault();
		e.stopPropagation();
		setIsFormSubmitted(true);
	}

	return (
		<Dialog>
			<DialogTrigger
				render={
					<button
						className={cn(
							"col-span-1 flex h-20 w-full border p-4 text-xs",
							isCurrentMonth ? "" : "text-muted-foreground",
							isDayToday && isCurrentMonth
								? "bg-primary text-primary-foreground"
								: "",
						)}
						onClick={addMovieEvent}
					>
						{label}
					</button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add movie</DialogTitle>
				</DialogHeader>
				<div>
					<form onSubmit={handleQuerySubmit}>
						<Input
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search title"
							value={query}
						/>
					</form>
					<ScrollArea className="col-span-2 h-full">
						<div className="flex flex-col gap-1">
							{movieSearchResults?.results.map((movie) => {
								const releaseYear = getReleaseYear(
									movie.release_date,
									movie.first_air_date,
								);

								return (
									<div className="flex items-start gap-2 rounded-lg border p-2">
										<div className="relative aspect-2/3 w-10 shrink-0 overflow-hidden">
											{movie.poster_path ? (
												<Image
													src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
													className="h-full w-full object-cover object-top"
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
												{movie.name}
											</h4>
											{releaseYear && (
												<p className="text-xs text-muted-foreground">
													{releaseYear}
												</p>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
}
