import { useConvexMutation, convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import MediaShelfLoadingState from "@/components/media-shelf-loading-state";
import MediaTypeIcon from "@/components/media-type-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { userProfileQueryOptions } from "@/queries/user-profile";
import { mediaTypes, type MediaType } from "@/types";

export const Route = createFileRoute("/_auth/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	return (
		<div className="animate-reveal-fade space-y-8 lg:space-y-10">
			<div className="space-y-2">
				<p className="section-label">Settings</p>
				<h1 className="text-2xl font-medium text-foreground lg:text-3xl">
					Your profile
				</h1>
			</div>

			<Suspense fallback={<SettingsLoading />}>
				<AccountSection />
				<LibrarySettingsSection />
			</Suspense>
		</div>
	);
}

function SettingsLoading() {
	return (
		<div className="space-y-8">
			<div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-6">
				<Skeleton className="size-12 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-3 w-48" />
				</div>
			</div>
			<MediaShelfLoadingState />
		</div>
	);
}

function AccountSection() {
	const { data: session } = authClient.useSession();

	return (
		<section className="space-y-4">
			<p className="section-label">Account</p>
			<div className="flex items-center gap-4 rounded-2xl border border-border bg-background p-6">
				<Avatar className="size-12">
					<AvatarImage
						alt={session?.user.name}
						src={session?.user.image ?? ""}
					/>
					<AvatarFallback>{session?.user.name[0]}</AvatarFallback>
				</Avatar>
				<div className="min-w-0">
					<p className="truncate text-sm font-medium text-foreground">
						{session?.user.name}
					</p>
					<p className="mt-1 truncate text-xs text-muted-foreground">
						{session?.user.email}
					</p>
				</div>
			</div>
		</section>
	);
}

const mediaTypeLabels = {
	movie: "Movies",
	tv: "TV Shows",
	anime: "Anime",
	book: "Books",
	manga: "Manga",
} satisfies Record<MediaType, string>;

function LibrarySettingsSection() {
	const { data: profile } = useSuspenseQuery(userProfileQueryOptions);
	const { data: logs } = useSuspenseQuery(convexQuery(api.logs.all, {}));
	const queryClient = useQueryClient();

	// Optimistically write the new preference into the cache so navigating
	// back to the library renders the updated tabs on the first paint.
	const applyOptimistic = (nextTypes: MediaType[]) => {
		queryClient.setQueryData(userProfileQueryOptions.queryKey, (old) =>
			old ? { ...old, mediaTypes: nextTypes } : old,
		);
	};

	const updateMutation = useMutation({
		mutationFn: useConvexMutation(api.users.updateMediaTypes),
	});

	const enabledTypes = new Set<MediaType>(profile.mediaTypes);

	const toggle = (type: MediaType) => {
		const isActive = enabledTypes.has(type);

		// Keep at least one media type enabled.
		if (isActive && enabledTypes.size === 1) {
			return;
		}

		if (isActive) {
			enabledTypes.delete(type);
		} else {
			enabledTypes.add(type);
		}

		// Preserve the canonical media type order.
		const nextTypes = mediaTypes.filter((mediaType) =>
			enabledTypes.has(mediaType),
		);

		applyOptimistic(nextTypes);
		updateMutation.mutate({ mediaTypes: nextTypes });
	};

	// Titles logged under disabled types stay saved but become invisible.
	const hiddenLogCount = logs.filter(
		(log) => !enabledTypes.has(log.metadata.type),
	).length;

	return (
		<section className="space-y-4">
			<div className="space-y-1">
				<p className="section-label">Library</p>
				<p className="text-sm text-muted-foreground">
					Choose the media types you track. They control the tabs in
					your library and search.
				</p>
			</div>

			<div className="rounded-2xl border border-border bg-background p-6">
				<div className="flex flex-wrap items-center gap-2">
					{mediaTypes.map((type) => {
						const isActive = enabledTypes.has(type);
						const isLastEnabled =
							isActive && enabledTypes.size === 1;

						return (
							<Button
								aria-pressed={isActive}
								className="text-xs"
								disabled={isLastEnabled}
								key={type}
								onClick={() => toggle(type)}
								size="sm"
								type="button"
								variant={isActive ? "default" : "outline"}
							>
								<MediaTypeIcon
									data-icon="inline-start"
									className={cn(
										isActive
											? "text-primary-foreground"
											: "text-muted-foreground",
									)}
									type={type}
								/>
								{mediaTypeLabels[type]}
							</Button>
						);
					})}
				</div>

				{hiddenLogCount > 0 && (
					<p className="mt-4 text-xs text-muted-foreground">
						{hiddenLogCount}{" "}
						{hiddenLogCount === 1 ? "title" : "titles"} in your
						library are hidden by this setting — nothing gets
						deleted.
					</p>
				)}
			</div>
		</section>
	);
}
