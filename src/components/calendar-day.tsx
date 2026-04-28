import { useQuery } from "@tanstack/react-query";
import { SubmitEvent, useState } from "react";
import { getContentSearchResults } from "@/actions/get-content-search-results";
import { cn } from "@/lib/utils";
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
	label: number;
	day: number;
	month: number;
	year: number;
	isCurrentMonth?: boolean;
	movieTitles?: string[];
};

export default function CalendarDay({
	label,
	day,
	month,
	year,
	isCurrentMonth = false,
	movieTitles = [],
}: Props) {
	const [isOpen, setIsOpen] = useState(false);
	const [query, setQuery] = useState("");
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const {
		data: movieSearchResults,
		// isPending,
		// isEnabled,
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
	const isCurrentDayCell = isDayToday && isCurrentMonth;

	function handleQuerySubmit(e: SubmitEvent) {
		e.preventDefault();
		e.stopPropagation();
		setIsFormSubmitted(true);
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger
				render={
					<button
						className={cn(
							"col-span-1 flex h-24 w-full flex-col gap-2 overflow-hidden border p-3 text-left text-xs",
							isCurrentMonth ? "" : "text-muted-foreground",
							isCurrentDayCell
								? "bg-primary text-primary-foreground"
								: "",
						)}
					>
						<span>{label}</span>
						<div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
							{movieTitles.slice(0, 3).map((title, index) => (
								<p
									key={`${title}-${index}`}
									className={cn(
										"truncate rounded-sm px-1.5 py-1 text-[11px] leading-tight",
										isCurrentDayCell
											? "bg-primary-foreground text-primary"
											: "bg-primary text-primary-foreground",
									)}
								>
									{title}
								</p>
							))}
							{movieTitles.length > 3 && (
								<p
									className={cn(
										"rounded-sm px-1.5 py-1 text-[11px] leading-tight opacity-90",
										isCurrentDayCell
											? "bg-primary-foreground text-primary"
											: "bg-primary text-primary-foreground",
									)}
								>
									+{movieTitles.length - 3} more
								</p>
							)}
						</div>
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
