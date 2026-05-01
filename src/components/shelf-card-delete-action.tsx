import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

type Props = {
	logId: Id<"logs">;
};

export default function ShelfCardDeleteAction(props: Props) {
	const removeLogMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.remove),
		onMutate: () => {
			toast.loading("Removing log...");
		},
		onSuccess: () => {
			toast.dismiss();
			toast.success("Removed log");
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	return (
		<DropdownMenuItem
			className="text-xs text-destructive"
			onClick={() => removeLogMutation.mutate({ logId: props.logId })}
		>
			Delete
		</DropdownMenuItem>
	);
}
