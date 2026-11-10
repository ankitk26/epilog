import { WarningCircleIcon } from "@phosphor-icons/react";
import { Button } from "./ui/button";

type Props = {
	onRetry?: () => void;
};

export default function SearchErrorState({ onRetry }: Props) {
	return (
		<div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
			<WarningCircleIcon
				className="size-7 text-destructive/70"
				weight="fill"
			/>
			<p className="text-lg font-normal text-foreground">
				Search service is down
			</p>
			{onRetry && (
				<Button onClick={onRetry} size="sm" variant="outline">
					Try again
				</Button>
			)}
		</div>
	);
}
