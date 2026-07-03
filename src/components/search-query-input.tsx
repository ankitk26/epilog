import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";

export default function SearchQueryInput() {
	const navigate = useNavigate({ from: "/search" });
	const { q, type } = useSearch({ from: "/_auth/search" });
	const [query, setQuery] = useState(q);

	function handleQuerySubmit(e: FormEvent) {
		e.preventDefault();
		e.stopPropagation();
		void navigate({ search: { q: query, type }, replace: true });
	}

	useEffect(() => {
		setQuery(q);
	}, [q]);

	return (
		<form onSubmit={handleQuerySubmit}>
			<div className="relative">
				<MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
				<Input
					className="h-12 w-full rounded-full border-hairline-strong bg-card pr-4 pl-12 text-base tracking-wide text-ink shadow-soft focus-visible:border-ink focus-visible:ring-0"
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search for a title…"
					value={query}
				/>
			</div>
		</form>
	);
}
