import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import SearchMediaTypeTabs from "@/components/search-media-type-tabs";
import SearchQueryInput from "@/components/search-query-input";
import SearchResultsPanel from "@/components/search-results-panel";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { useProfileMediaTypes } from "@/hooks/use-profile-media-types";
import { defaultMediaFilters } from "@/lib/media-filters";
import type { MediaType } from "@/types";

const DEFAULT_MEDIA_TYPE = defaultMediaFilters.type;

type SearchSheetContextValue = {
	open: () => void;
};

const SearchSheetContext = createContext<SearchSheetContextValue | null>(null);

export function SearchSheetProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);

	return (
		<SearchSheetContext.Provider value={{ open }}>
			{children}
			<SearchSheetContent isOpen={isOpen} onOpenChange={setIsOpen} />
		</SearchSheetContext.Provider>
	);
}

export function useSearchSheet() {
	const context = useContext(SearchSheetContext);

	if (!context) {
		throw new Error(
			"useSearchSheet must be used within SearchSheetProvider",
		);
	}

	return context;
}

function SearchSheetContent({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [query, setQuery] = useState("");
	const [submittedQuery, setSubmittedQuery] = useState("");
	const [mediaType, setMediaType] = useState<MediaType>(DEFAULT_MEDIA_TYPE);
	const { type: viewingType } = useMediaFilters();

	// Opening the drawer keeps it looking at the same media type the
	// library is viewing; the query and results persist across opens.
	useEffect(() => {
		if (isOpen) {
			setMediaType(viewingType);
		}
	}, [isOpen, viewingType]);

	// While the profile loads we cannot validate yet; once ready, a type
	// disabled in settings is derived away immediately.
	const { enabled: enabledMediaTypes, isReady } = useProfileMediaTypes();
	const activeType =
		isReady && !enabledMediaTypes.includes(mediaType)
			? (enabledMediaTypes[0] ?? DEFAULT_MEDIA_TYPE)
			: mediaType;

	const handleOpenChange = useCallback(
		(nextOpen: boolean) => {
			onOpenChange(nextOpen);
		},
		[onOpenChange],
	);

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetContent className="w-full sm:max-w-xl lg:max-w-2xl">
				<div className="flex h-full min-h-0 flex-col">
					<SheetHeader className="border-b border-border">
						<SheetTitle className="text-lg font-medium tracking-tight text-foreground">
							Search the catalog
						</SheetTitle>
						<SheetDescription>
							Find something new to add to your library.
						</SheetDescription>
					</SheetHeader>

					<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pt-4 pb-4 sm:px-6 sm:pb-6">
						<div className="flex flex-col gap-3">
							<SearchQueryInput
								autoFocus
								onChange={setQuery}
								onSubmit={() => setSubmittedQuery(query)}
								value={query}
							/>
							<SearchMediaTypeTabs
								onChange={setMediaType}
								value={activeType}
							/>
						</div>

						<SearchResultsPanel
							query={submittedQuery}
							type={activeType}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
