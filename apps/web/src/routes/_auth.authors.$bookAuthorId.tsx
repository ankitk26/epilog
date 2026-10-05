import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Suspense } from "react";
import { getAuthorWorks } from "@/actions/get-author-works";
import MediaCard, { type MediaCardMedia } from "@/components/media-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const BOOK_AUTHOR_ID_PATTERN = /^OL\d+A$/;

const authorWorksQueryOptions = (bookAuthorId: string) =>
	queryOptions({
		queryKey: ["author-works", bookAuthorId],
		queryFn: () => getAuthorWorks({ data: { bookAuthorId } }),
	});

export const Route = createFileRoute("/_auth/authors/$bookAuthorId")({
	component: AuthorPage,
	validateSearch: (search) => ({
		view:
			search.view === "grid" || search.view === "list"
				? search.view
				: undefined,
	}),
	beforeLoad: ({ params }) => {
		if (!BOOK_AUTHOR_ID_PATTERN.test(params.bookAuthorId)) {
			throw new Error("Invalid Open Library author id");
		}
	},
	loader: ({ context, params }) => {
		void context.queryClient.ensureQueryData(
			authorWorksQueryOptions(params.bookAuthorId),
		);
	},
});

type AuthorWorkView = "grid" | "list";

function AuthorPage() {
	const { bookAuthorId } = Route.useParams();

	return (
		<Suspense fallback={<AuthorPageLoading />}>
			<AuthorPageContent bookAuthorId={bookAuthorId} />
		</Suspense>
	);
}

function AuthorPageContent({ bookAuthorId }: { bookAuthorId: string }) {
	const { data } = useSuspenseQuery(authorWorksQueryOptions(bookAuthorId));
	const { author, works } = data.data;

	return (
		<div className="animate-reveal-fade space-y-8 lg:space-y-10">
			<div className="flex items-center gap-4">
				{author.imageUrl && (
					<img
						alt=""
						aria-hidden="true"
						className="size-14 flex-shrink-0 rounded-full object-cover ring-1 ring-border"
						src={author.imageUrl}
					/>
				)}
				<div className="min-w-0 space-y-1">
					<p className="section-label">Author</p>
					<h1 className="truncate text-2xl font-medium text-foreground lg:text-3xl">
						{author.name}
					</h1>
				</div>
			</div>

			{works.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No works found for this author on Open Library.
				</p>
			) : (
				<AuthorWorksSection works={works} />
			)}
		</div>
	);
}

type Work = {
	id: string;
	title: string;
	imageUrl: string | null;
	publishYear: number | null;
};

// Mirrors the library's MediaSectionByStatus layout: big section title with
// count, a view switcher, and the shared MediaCard grid/list renderers.
// Cards omit the author name — every work belongs to the page's author.
function AuthorWorksSection({ works }: { works: Work[] }) {
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const { view } = Route.useSearch();
	const viewParam = view ?? "grid";
	// Same mobile normalization as the library: toggling to grid is
	// desktop-only; mobile is a list.
	const effectiveView = isMobile && viewParam === "grid" ? "list" : viewParam;

	const setView = (nextView: AuthorWorkView) => {
		void navigate({
			replace: true,
			search: (prev) => ({ ...prev, view: nextView }),
		});
	};

	const viewOptions = [
		{ value: "grid" as const, label: "Grid", icon: SquaresFourIcon },
		{ value: "list" as const, label: "List", icon: ListIcon },
	];

	return (
		<section className="animate-reveal-up space-y-6">
			<div className="flex items-end justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-3xl font-medium tracking-tight text-foreground lg:text-4xl">
						Works
					</h2>
					<span className="section-label shrink-0 pl-1 whitespace-nowrap">
						{works.length} titles
					</span>
				</div>

				{/* View switcher — same icon buttons as the library toolbar */}
				<div className="flex shrink-0 items-center gap-1">
					{viewOptions.map((option) => {
						// Mirror the library: mobile shows the list toggle only.
						if (isMobile && option.value === "grid") {
							return null;
						}

						const Icon = option.icon;
						const isActive = effectiveView === option.value;

						return (
							<Tooltip key={`${option.value}_filter`}>
								<TooltipTrigger
									render={
										<Button
											className={cn(
												isActive
													? "text-primary-foreground"
													: "text-muted-foreground hover:text-foreground",
											)}
											onClick={() =>
												setView(option.value)
											}
											title={option.label}
											variant={
												isActive ? "default" : "outline"
											}
											size="icon"
										>
											<Icon />
											<span className="sr-only">
												{option.label}
											</span>
										</Button>
									}
								/>
								<TooltipContent>{option.label}</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
			</div>

			<div
				className={
					effectiveView === "list"
						? "flex flex-col gap-8"
						: "grid auto-rows-max grid-cols-2 items-start gap-8 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] lg:gap-8"
				}
			>
				{works.map((work) => {
					const media: MediaCardMedia = {
						imageUrl: work.imageUrl,
						name: work.title,
						releaseYear: work.publishYear,
						// The library card shows the author here; on the author
						// page the release year takes that slot instead.
						secondaryText: work.publishYear
							? String(work.publishYear)
							: null,
						type: "book",
					};

					const openOnOpenLibrary = () => {
						window.open(
							`https://openlibrary.org/works/${work.id}`,
							"_blank",
							"noopener,noreferrer",
						);
					};

					return effectiveView === "list" ? (
						<MediaCard.List
							key={work.id}
							media={media}
							onClick={openOnOpenLibrary}
						/>
					) : (
						<MediaCard.Grid
							key={work.id}
							media={media}
							onClick={openOnOpenLibrary}
						/>
					);
				})}
			</div>
		</section>
	);
}

function AuthorPageLoading() {
	return (
		<div className="space-y-8 lg:space-y-10">
			<div className="flex items-center gap-4">
				<Skeleton className="size-14 rounded-full" />
				<div className="space-y-2">
					<Skeleton className="h-3 w-16" />
					<Skeleton className="h-7 w-48" />
				</div>
			</div>
			<div className="space-y-6">
				<div className="space-y-1">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-3 w-16" />
				</div>
				<div className="grid grid-cols-2 gap-8 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] lg:gap-8">
					{Array.from({ length: 12 }).map((_, index) => (
						<div key={`author-work-skeleton-${index + 1}`}>
							<Skeleton className="aspect-[2/3] w-full rounded-md" />
							<div className="space-y-2 pt-3">
								<Skeleton className="h-4 w-5/6" />
								<Skeleton className="h-3 w-1/2" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
