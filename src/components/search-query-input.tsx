import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { type FormEvent } from "react";
import { Input } from "./ui/input";

type Props = {
	autoFocus?: boolean;
	onChange: (value: string) => void;
	onSubmit?: () => void;
	value: string;
};

export default function SearchQueryInput({
	autoFocus,
	onChange,
	onSubmit,
	value,
}: Props) {
	function handleQuerySubmit(e: FormEvent) {
		e.preventDefault();
		e.stopPropagation();
		onSubmit?.();
	}

	return (
		<form onSubmit={handleQuerySubmit}>
			<div className="relative">
				<MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" />
				<Input
					autoFocus={autoFocus}
					className="h-12 w-full rounded-lg border-hairline-strong bg-card pr-4 pl-12 text-sm tracking-wide text-ink shadow-soft focus-visible:border-ink focus-visible:ring-0 lg:h-12 lg:pl-12 lg:text-base"
					onChange={(e) => onChange(e.target.value)}
					placeholder="Search for a title…"
					value={value}
				/>
			</div>
		</form>
	);
}
