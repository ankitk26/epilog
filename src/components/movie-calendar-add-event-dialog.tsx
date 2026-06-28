import { SpinnerIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { SubmitEvent, useEffect, useState, type ReactElement } from "react";
import { searchTmdbMoviesAndTv } from "@/actions/search-tmdb-movies-and-tv";
import MovieCalendarSearchResultRow from "./movie-calendar-search-result-row";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";

type Props = {
	children?: ReactElement;
	day: number;
	month: number;
	year: number;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
};

export default function MovieCalendarAddEventDialog({
	children,
	day,
	month,
	year,
	open: controlledOpen,
	onOpenChange,
}: Props) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isOpen = controlledOpen ?? internalOpen;
	const setIsOpen = (value: boolean) => {
		if (onOpenChange) {
			onOpenChange(value);
		} else {
			setInternalOpen(value);
		}
	};
	const [query, setQuery] = useState("");
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const { data: movieSearchResultsPanel, isFetching } = useQuery({
		queryKey: ["search", "media-content", "movie", query],
		queryFn: async () =>
			await searchTmdbMoviesAndTv({
				data: { searchQuery: query, mediaType: "movie" },
			}),
		enabled: query.length !== 0 && isFormSubmitted,
		refetchOnWindowFocus: false,
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
			{children && <DialogTrigger render={children} />}
			<DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add movie</DialogTitle>
				</DialogHeader>
				<div className="flex min-h-0 flex-1 flex-col gap-3">
					<form
						onSubmit={handleQuerySubmit}
						className="flex items-center gap-2"
					>
						<Input
							onChange={(e) => {
								setQuery(e.target.value);
								setIsFormSubmitted(false);
							}}
							placeholder="Search movie"
							value={query}
							className="flex-1"
						/>
						<Button type="submit" disabled={!query || isFetching}>
							{isFetching ? (
								<SpinnerIcon className="size-3.5 animate-spin" />
							) : (
								"Search"
							)}
						</Button>
					</form>
					<div className="min-h-0 flex-1 overflow-y-auto pr-1">
						{isFetching && (
							<div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
								<SpinnerIcon className="size-4 animate-spin" />
								<span className="text-sm">Searching…</span>
							</div>
						)}
						{!isFetching && movieSearchResultsPanel && (
							<div className="flex flex-col gap-1">
								{movieSearchResultsPanel.results.length ===
									0 && (
									<p className="py-8 text-center text-sm text-muted-foreground">
										No results found.
									</p>
								)}
								{movieSearchResultsPanel.results.map(
									(movie) => (
										<MovieCalendarSearchResultRow
											key={movie.id}
											movie={movie}
											day={day}
											month={month}
											year={year}
											closeDialog={() => setIsOpen(false)}
										/>
									),
								)}
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
