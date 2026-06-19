import { useConvexMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { Image } from "@unpic/react";
import type { FunctionReturnType } from "convex/server";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import IconByType from "./icon-by-type";

type Log = FunctionReturnType<typeof api.logs.all>[0];

type Props = {
	log: Log | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

function getStatusOptions(type: MediaType) {
	return [
		{
			value: "planned" as const,
			label: type === "book" ? "To Read" : "To Watch",
		},
		{
			value: "in_progress" as const,
			label: type === "book" ? "Reading" : "Watching",
		},
		{ value: "completed" as const, label: "Completed" },
	];
}

function formatMediaType(type: MediaType) {
	switch (type) {
		case "tv":
			return "TV";
		default:
			return type.charAt(0).toUpperCase() + type.slice(1);
	}
}

export default function LogDetailsDialog({ log, open, onOpenChange }: Props) {
	const [status, setStatus] = useState<Log["status"]>("planned");

	useEffect(() => {
		if (log) {
			setStatus(log.status);
		}
	}, [log]);

	const updateMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.update),
		onMutate: () => {
			toast.loading("Saving changes...");
		},
		onSuccess: () => {
			toast.dismiss();
			toast.success("Log updated");
			onOpenChange(false);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	const removeMutation = useMutation({
		mutationFn: useConvexMutation(api.logs.remove),
		onMutate: () => {
			toast.loading("Removing log...");
		},
		onSuccess: () => {
			toast.dismiss();
			toast.success("Removed log");
			onOpenChange(false);
		},
		onError: () => {
			toast.dismiss();
			toast.error("Something went wrong!");
		},
	});

	const handleSave = () => {
		if (!log) return;
		updateMutation.mutate({ logId: log._id, status });
	};

	const handleDelete = () => {
		if (!log) return;
		removeMutation.mutate({ logId: log._id });
	};

	const mediaType = log?.metadata.type ?? "movie";
	const isLoading = updateMutation.isPending || removeMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="flex max-h-[80vh] flex-col rounded-2xl border border-hairline p-6 shadow-lift sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="font-heading text-xl leading-tight font-normal tracking-tight text-ink">
						{log?.metadata.name || "Untitled"}
					</DialogTitle>
				</DialogHeader>

				{log && (
					<div className="flex flex-col gap-5">
						{/* Media summary */}
						<div className="flex gap-4">
							<div className="h-30 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-secondary">
								{log.metadata.image ? (
									<Image
										alt={
											log.metadata.name || "Media poster"
										}
										className="h-full w-full object-cover"
										height={120}
										src={log.metadata.image}
										width={80}
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<IconByType
											className="size-5 text-muted-foreground/50"
											type={log.metadata.type}
										/>
									</div>
								)}
							</div>

							<div className="min-w-0 flex-1 space-y-1.5 pt-1">
								{log.metadata.releaseYear && (
									<p className="text-xs text-muted-foreground tabular-nums">
										{log.metadata.releaseYear}
									</p>
								)}
								<Badge
									className="rounded-full bg-secondary text-[11px] font-semibold tracking-wide text-muted-foreground"
									variant="secondary"
								>
									{formatMediaType(log.metadata.type)}
								</Badge>
							</div>
						</div>

						{/* Status field */}
						<div className="space-y-2.5">
							<label className="eyebrow block">Status</label>
							<div className="flex flex-wrap gap-2">
								{getStatusOptions(mediaType).map((option) => {
									const isActive = status === option.value;
									return (
										<button
											className={cn(
												"h-9 cursor-pointer rounded-full border px-4 text-[13px] font-medium tracking-wide transition-all duration-200 disabled:opacity-50",
												isActive
													? "border-transparent bg-primary text-primary-foreground shadow-soft"
													: "border-hairline-strong bg-transparent text-muted-foreground hover:border-ink/30 hover:text-ink",
											)}
											disabled={isLoading}
											key={option.value}
											onClick={() =>
												setStatus(option.value)
											}
											type="button"
										>
											{option.label}
										</button>
									);
								})}
							</div>
						</div>

						{/* Footer actions */}
						<div className="flex items-center justify-between gap-2 border-t border-hairline pt-4">
							<Button
								className="h-9 gap-1.5 rounded-full px-4 text-[13px] font-medium text-destructive hover:bg-destructive/10"
								disabled={isLoading}
								onClick={handleDelete}
								size="sm"
								variant="ghost"
							>
								Delete
							</Button>

							<div className="flex items-center gap-2">
								<Button
									className="h-9 rounded-full border border-hairline-strong bg-transparent px-4 text-[13px] font-medium text-ink hover:bg-secondary"
									disabled={isLoading}
									onClick={() => onOpenChange(false)}
									size="sm"
									variant="outline"
								>
									Cancel
								</Button>
								<Button
									className="h-9 rounded-full bg-primary px-5 text-[13px] font-medium text-primary-foreground shadow-soft transition-all hover:shadow-lift disabled:opacity-40"
									disabled={
										isLoading || status === log.status
									}
									onClick={handleSave}
									size="sm"
								>
									Save
								</Button>
							</div>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
