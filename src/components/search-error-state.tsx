import { WarningCircleIcon } from "@phosphor-icons/react";

export default function SearchErrorState() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
			<WarningCircleIcon
				className="size-7 text-destructive/70"
				weight="fill"
			/>
			<p className="font-heading text-lg font-normal text-foreground">
				Search service is down
			</p>
		</div>
	);
}
