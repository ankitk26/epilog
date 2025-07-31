import { searchStore } from "@/store/search-store";
import { useStore } from "@tanstack/react-store";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";

export default function SearchInput() {
  const [query, setQuery] = useState("");

  const searchQuery = useStore(searchStore, (state) => state.searchQuery);

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
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search title"
      />
    </form>
  );
}
