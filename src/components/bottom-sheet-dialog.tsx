import * as React from "react";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type BottomSheetDialogContentProps = React.ComponentProps<
	typeof DialogContent
> & {
	showCloseButton?: boolean;
};

/**
 * A dialog that renders as a bottom sheet on mobile (rounded top, flush to
 * the bottom edge) and a centered modal on `sm:` breakpoints.
 *
 * Delegates to the native `ui/dialog` `DialogContent`, so the bottom-sheet
 * layout is the only thing baked in here. Close-button styling stays
 * centralized in `ui/dialog.tsx` — pass `showCloseButton` to opt into the
 * native close button, or render your own `DialogClose` trigger.
 */
function BottomSheetDialogContent({
	className,
	children,
	showCloseButton = false,
	...props
}: BottomSheetDialogContentProps) {
	return (
		<DialogContent
			className={cn(
				"top-auto right-0 bottom-0 left-0 flex max-h-[85vh] max-w-full translate-x-0 translate-y-0 flex-col overflow-hidden rounded-t-lg rounded-b-none border border-b-0 border-border p-0 shadow-lift sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-lg sm:border-b",
				className,
			)}
			showCloseButton={showCloseButton}
			{...props}
		>
			{children}
		</DialogContent>
	);
}

export { BottomSheetDialogContent, Dialog, DialogClose };
