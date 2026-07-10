import { useSearch } from "@tanstack/react-router";
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
	const { type: homeType } = useSearch({ from: "/_auth/" });

	const [query, setQuery] = useState("");
	const [submittedQuery, setSubmittedQuery] = useState("");
	const [mediaType, setMediaType] = useState<MediaType>(homeType);

	useEffect(() => {
		if (isOpen) {
			setMediaType(homeType);
		}
	}, [isOpen, homeType]);

	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) {
				setQuery("");
				setSubmittedQuery("");
			}
			onOpenChange(open);
		},
		[onOpenChange],
	);

	return (
		<Sheet open={isOpen} onOpenChange={handleOpenChange}>
			<SheetContent
				className="border-l border-border bg-canvas shadow-lift data-[side=right]:w-full data-[side=right]:sm:max-w-xl data-[side=right]:lg:max-w-2xl"
				side="right"
			>
				<div className="flex h-full flex-col">
					<SheetHeader className="shrink-0 p-4 pt-6 lg:p-6">
						<SheetTitle className="display text-xl tracking-tight lg:text-2xl">
							Search library
						</SheetTitle>
					</SheetHeader>

					<div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pt-2 pb-6 lg:gap-8 lg:px-6 lg:pb-8">
						<div className="space-y-4 lg:space-y-6">
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
