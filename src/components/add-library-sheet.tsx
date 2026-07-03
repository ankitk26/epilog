import {
	createContext,
	useCallback,
	useContext,
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
import type { MediaType } from "@/types";

type AddLibrarySheetContextValue = {
	close: () => void;
	isOpen: boolean;
	open: () => void;
};

const AddLibrarySheetContext =
	createContext<AddLibrarySheetContextValue | null>(null);

const DEFAULT_MEDIA_TYPE: MediaType = "anime";

export function AddLibrarySheetProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	return (
		<AddLibrarySheetContext.Provider value={{ close, isOpen, open }}>
			{children}
			<AddLibrarySheetContent isOpen={isOpen} onOpenChange={setIsOpen} />
		</AddLibrarySheetContext.Provider>
	);
}

export function useAddLibrarySheet() {
	const context = useContext(AddLibrarySheetContext);

	if (!context) {
		throw new Error(
			"useAddLibrarySheet must be used within AddLibrarySheetProvider",
		);
	}

	return context;
}

function AddLibrarySheetContent({
	isOpen,
	onOpenChange,
}: {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [query, setQuery] = useState("");
	const [submittedQuery, setSubmittedQuery] = useState("");
	const [mediaType, setMediaType] = useState<MediaType>(DEFAULT_MEDIA_TYPE);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) {
				setQuery("");
				setSubmittedQuery("");
				setMediaType(DEFAULT_MEDIA_TYPE);
			}
			onOpenChange(open);
		},
		[onOpenChange],
	);

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetContent
				className="w-full border-l border-hairline bg-canvas shadow-lift sm:max-w-xl lg:max-w-2xl"
				side="right"
			>
				<div className="flex h-full flex-col">
					<SheetHeader className="shrink-0">
						<SheetTitle className="display text-2xl tracking-tight">
							Find your next.
						</SheetTitle>
						<SheetDescription>
							Search for something new to add to your library.
						</SheetDescription>
					</SheetHeader>

					<div className="flex flex-1 flex-col gap-8 overflow-y-auto px-6 pt-2 pb-8">
						<div className="space-y-6">
							<SearchQueryInput
								autoFocus
								onChange={setQuery}
								onSubmit={() => setSubmittedQuery(query)}
								value={query}
							/>
							<SearchMediaTypeTabs
								onChange={setMediaType}
								value={mediaType}
							/>
						</div>

						<SearchResultsPanel
							query={submittedQuery}
							type={mediaType}
						/>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
