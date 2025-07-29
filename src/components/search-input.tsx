import { useSearchStore } from "@/store/search-store";
import { FormEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";

export default function SearchInput() {
  const [query, setQuery] = useState("");

  const searchQuery = useSearchStore((store) => store.searchQuery);
  const setSearchQuery = useSearchStore((store) => store.setSearchQuery);

  function handleQuerySubmit(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSearchQuery(query);
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
