import { useSelector } from "@tanstack/react-store";
import { type FormEvent, useEffect, useState } from "react";
import { searchStore } from "@/store/search-store";
import { Input } from "./ui/input";

export default function SearchInput() {
	const [query, setQuery] = useState("");

	const searchQuery = useSelector(searchStore, (state) => state.searchQuery);

	function handleQuerySubmit(e: FormEvent) {
		e.preventDefault();
		e.stopPropagation();
		searchStore.setState((state) => ({ ...state, searchQuery: query }));
	}

	useEffect(() => {
		setQuery(searchQuery);
	}, [searchQuery]);

	return (
		<form onSubmit={handleQuerySubmit}>
			<div className="relative">
				<Input
					className="h-12 rounded-2xl border-border/60 bg-card text-base shadow-sm transition-all duration-300 hover:border-border hover:shadow-md focus-visible:shadow-md md:text-sm"
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search for movies, shows, anime, books..."
					value={query}
				/>
			</div>
		</form>
	);
}
