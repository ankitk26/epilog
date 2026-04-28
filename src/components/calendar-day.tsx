import { useQuery } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { getContentSearchResults } from "@/actions/get-content-search-results";
import { cn } from "@/lib/utils";
import MovieSearchResultItem from "./movie-search-result-item";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

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

	function handleMovieClick(movie: {
		id: number;
		name?: string | null;
		title?: string | null;
	}) {
		const actualMonth = month + 1;
		console.log({
			date: `${day}-${actualMonth}-${year}`,
			movieId: movie.id,
			movieTitle: movie.name ?? movie.title ?? "N/A",
		});
	}

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
			<DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add movie</DialogTitle>
				</DialogHeader>
				<div className="flex min-h-0 flex-1 flex-col gap-3">
					<form onSubmit={handleQuerySubmit}>
						<Input
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search movie"
							value={query}
						/>
					</form>
					<div className="min-h-0 flex-1 overflow-y-auto pr-1">
						<div className="flex flex-col gap-1">
							{movieSearchResults?.results.map((movie) => (
								<MovieSearchResultItem
									key={movie.id}
									movie={movie}
									onClick={handleMovieClick}
								/>
							))}
						</div>
					</div>
				</div>
				<DialogFooter>
					<DialogClose>Cancel</DialogClose>
					<Button>Submit</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
