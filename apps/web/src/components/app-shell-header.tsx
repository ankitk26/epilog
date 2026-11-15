import {
	GearIcon,
	MagnifyingGlassIcon,
	SignOutIcon,
} from "@phosphor-icons/react";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSearchSheet } from "@/components/search-sheet";
import { useMediaFilters } from "@/hooks/use-media-filters";
import { useProfileMediaTypes } from "@/hooks/use-profile-media-types";
import { authClient } from "@/lib/auth-client";
import {
	defaultMediaFilters,
	normalizeMediaFilterView,
} from "@/lib/media-filters";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/types";
import { ThemeModeToggle } from "./theme-mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const mediaTypeLinks: Array<{ type: MediaType; label: string }> = [
	{ type: "movie", label: "Movies" },
	{ type: "tv", label: "TV Shows" },
	{ type: "anime", label: "Anime" },
	{ type: "book", label: "Books" },
	{ type: "manga", label: "Manga" },
];

export default function AppShellHeader() {
	const navigate = useNavigate();
	const { type, view } = useMediaFilters();
	const { enabled: enabledMediaTypes } = useProfileMediaTypes();
	const { data } = authClient.useSession();
	const { open: openSearchSheet } = useSearchSheet();

	useHotkey("Mod+K", openSearchSheet);

	const handleSignOut = async () => {
		await navigate({ to: "/sign-in" });
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.reload();
				},
			},
		});
	};

	return (
		<header className="safe-area-top sticky top-0 z-30 bg-background/90 px-6 backdrop-blur-xl lg:px-12">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-6 lg:h-20">
				<div className="flex min-w-0 items-center gap-6">
					<Link
						className="shrink-0 text-base font-semibold tracking-tight text-foreground"
						search={defaultMediaFilters}
						to="/"
					>
						epilog
					</Link>

					<nav
						aria-label="Media types"
						className="no-scrollbar hidden min-w-0 items-center gap-4 overflow-x-auto lg:flex"
					>
						{mediaTypeLinks
							.filter((item) =>
								enabledMediaTypes.includes(item.type),
							)
							.map((item) => (
								<Link
									className={cn(
										"shrink-0 text-sm font-medium hover:text-foreground",
										item.type === type
											? "text-foreground underline decoration-2 underline-offset-4"
											: "text-muted-foreground no-underline",
									)}
									key={item.type}
									search={{
										type: item.type,
										view: normalizeMediaFilterView(
											item.type,
											view,
										),
									}}
									to="/"
								>
									{item.label}
								</Link>
							))}
					</nav>
				</div>

				<div className="flex items-center gap-2 sm:gap-3">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Search library"
									onClick={openSearchSheet}
									size="icon"
									variant="outline"
								>
									<MagnifyingGlassIcon />
								</Button>
							}
						/>
						<TooltipContent className="rounded-lg">
							Search library
							<kbd className="ml-2 rounded-md bg-background/20 px-2 py-1 text-xs font-medium">
								{formatForDisplay("Mod+K")}
							</kbd>
						</TooltipContent>
					</Tooltip>

					<ThemeModeToggle />

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									className="overflow-hidden border-0 p-0"
									size="icon"
									variant="outline"
								>
									<Avatar className="p-0 shadow-sm after:border-0">
										<AvatarImage
											alt={data?.user.name}
											src={data?.user.image ?? ""}
										/>
										<AvatarFallback>
											{data?.user.name[0]}
										</AvatarFallback>
									</Avatar>
								</Button>
							}
						/>
						<DropdownMenuContent align="end" className="w-52">
							<div className="px-3 py-2">
								<p className="text-sm font-medium text-foreground">
									{data?.user.name}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{data?.user.email}
								</p>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-xs"
								onClick={() =>
									void navigate({ to: "/settings" })
								}
							>
								<GearIcon className="size-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-xs"
								onClick={handleSignOut}
							>
								<SignOutIcon className="size-4" />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
