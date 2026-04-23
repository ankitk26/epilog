import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { KanbanIcon, LayoutGridIcon, ListIcon } from "lucide-react";
import { Suspense } from "react";
import KanbanView from "@/components/kanban-view";
import ListViewByStatus from "@/components/list-view-by-status";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { filterStore } from "@/store/filter-store";
import type { FilterMediaView, MediaType } from "@/types";

export const Route = createFileRoute("/_auth/")({
	component: Home,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(convexQuery(api.logs.all, {}));
	},
});

function Home() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<div className="space-y-6">
				<HomeToolbar />
				<HomeContent />
			</div>
		</Suspense>
	);
}

function HomeContent() {
	const view = useStore(filterStore, (state) => state.view);

	if (view === "kanban") {
		return <KanbanView />;
	}

	return <ListViewByStatus />;
}

function HomeToolbar() {
	const view = useStore(filterStore, (state) => state.view);
	const type = useStore(filterStore, (state) => state.type);

	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));

	const logCountsByType = [
		{
			type: "anime",
			label: "Anime",
			count: logs.filter((log) => log.metadata.type === "anime").length,
		},
		{
			type: "movie",
			label: "Movies",
			count: logs.filter((log) => log.metadata.type === "movie").length,
		},
		{
			type: "tv",
			label: "TV Shows",
			count: logs.filter((log) => log.metadata.type === "tv").length,
		},
		{
			type: "book",
			label: "Books",
			count: logs.filter((log) => log.metadata.type === "book").length,
		},
	];

	const viewOptions: {
		value: FilterMediaView;
		label: string;
		icon: typeof ListIcon;
	}[] = [
		{ value: "list", label: "List", icon: ListIcon },
		{ value: "grid", label: "Grid", icon: LayoutGridIcon },
		{ value: "kanban", label: "Kanban", icon: KanbanIcon },
	];

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			{/* Media type filter */}
			<div className="flex flex-wrap items-center gap-2">
				{logCountsByType.map((item) => {
					const isActive = type === item.type;
					return (
						<button
							className={cn(
								"flex h-8 cursor-pointer items-center gap-1.5 rounded-full border-0 px-3 text-xs leading-none font-medium transition-colors",
								isActive
									? "bg-primary text-primary-foreground hover:bg-primary/80"
									: "bg-muted text-muted-foreground hover:bg-muted/80",
							)}
							key={item.type}
							onClick={() =>
								filterStore.setState((state) => ({
									...state,
									type: item.type as MediaType,
								}))
							}
							type="button"
						>
							<span className="leading-none">{item.label}</span>
							<span
								className={cn(
									"flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-xs leading-none font-medium",
									isActive
										? "bg-primary-foreground/25 text-primary-foreground"
										: "bg-background/60 text-muted-foreground",
								)}
							>
								{item.count}
							</span>
						</button>
					);
				})}
			</div>

			{/* View switcher */}
			<div className="flex items-center gap-1 rounded-lg border p-1">
				{viewOptions.map((option) => {
					const Icon = option.icon;
					const isActive = view === option.value;
					return (
						<Button
							className={cn(
								"h-7 w-7 p-0",
								isActive
									? "bg-accent text-accent-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
							key={option.value}
							onClick={() =>
								filterStore.setState((state) => ({
									...state,
									view: option.value,
								}))
							}
							size="icon"
							variant="ghost"
							title={option.label}
						>
							<Icon className="size-3.5" />
							<span className="sr-only">{option.label}</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
}
