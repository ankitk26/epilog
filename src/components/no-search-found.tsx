import { useSelector } from "@tanstack/react-store";
import { searchStore } from "@/store/search-store";
import SearchIconByType from "./search-icon-by-type";

export default function NoSearchFound() {
	const mediaType = useSelector(searchStore, (state) => state.mediaType);

	return (
		<div className="flex flex-col items-center justify-center py-8 text-center">
			<SearchIconByType
				className="mb-2 size-8 text-muted-foreground"
				type={mediaType}
			/>
			<p className="text-sm text-muted-foreground">No results found</p>
			<p className="text-xs text-muted-foreground">
				Try a different search term
			</p>
		</div>
	);
}
