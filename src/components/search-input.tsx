import { MagnifyingGlassIcon } from "@phosphor-icons/react";
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
				<MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="h-12 w-full rounded-full border-hairline-strong bg-card pl-12 pr-4 text-[15px] tracking-wide text-ink shadow-soft focus-visible:border-ink focus-visible:ring-0"
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search for a title…"
					value={query}
				/>
			</div>
		</form>
	);
}
