import { useQuery } from "@tanstack/react-query";
import { SubmitEvent, useEffect, useState, type ReactElement } from "react";
import { getContentSearchResults } from "@/actions/get-content-search-results";
import MovieSearchResultItem from "./movie-search-result-item";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

type Props = {
	children: ReactElement;
	day: number;
	month: number;
	year: number;
};

export default function CalendarDayAddMovieDialog({
	children,
	day,
	month,
	year,
}: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const { data: movieSearchResults } = useQuery({
		queryKey: ["search", "media-content", "movie", query],
		queryFn: async () =>
			await getContentSearchResults({
				data: { searchQuery: query, mediaType: "movie" },
			}),
		enabled: query.length !== 0 && isFormSubmitted,
	});

	useEffect(() => {
		if (!isOpen) {
			setQuery("");
			setIsFormSubmitted(false);
		}
	}, [isOpen]);

	function handleQuerySubmit(e: SubmitEvent) {
		e.preventDefault();
		e.stopPropagation();
		setIsFormSubmitted(true);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger render={children} />
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
									day={day}
									month={month}
									year={year}
									closeDialog={() => setIsOpen(false)}
								/>
							))}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
