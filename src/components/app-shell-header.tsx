import { MagnifyingGlassIcon, SignOutIcon } from "@phosphor-icons/react";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { defaultMediaFilters } from "@/lib/media-filters";
import { mediaTypes, type MediaType } from "@/types";
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

function isMediaType(value: string | null): value is MediaType {
	return value !== null && mediaTypes.some((type) => type === value);
}

export default function AppShellHeader() {
	const navigate = useNavigate();
	const { data } = authClient.useSession();
	const { isSearchPage, selectedMediaType } = useRouterState({
		select: (state) => {
			const type = new URL(
				state.location.href,
				"http://localhost",
			).searchParams.get("type");
			return {
				isSearchPage: state.location.pathname === "/search",
				selectedMediaType: isMediaType(type)
					? type
					: defaultMediaFilters.type,
			};
		},
	});

	const toggleSearch = () => {
		if (isSearchPage) {
			void navigate({
				to: "/",
				search: {
					...defaultMediaFilters,
					type: selectedMediaType,
				},
			});
			return;
		}

		void navigate({
			to: "/search",
			search: { type: selectedMediaType },
		});
	};

	useHotkey("Mod+K", toggleSearch);

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
		<header className="fixed top-0 right-0 left-0 z-30 border-b border-border/40 bg-background/75 px-6 pt-[env(safe-area-inset-top)] shadow-sm backdrop-blur-md backdrop-saturate-150 lg:px-12">
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between lg:h-20">
				<Link
					className="group flex items-baseline"
					search={defaultMediaFilters}
					to="/"
				>
					<span className="text-sm font-semibold tracking-[0.2em] text-foreground uppercase transition-opacity fine-hover:hover:opacity-60">
						epilog
					</span>
				</Link>

				<div className="flex items-center gap-2 sm:gap-3">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label={
										isSearchPage
											? "Back to library"
											: "Search library"
									}
									onClick={toggleSearch}
									size="icon"
									variant="outline"
								>
									<MagnifyingGlassIcon />
								</Button>
							}
						/>
						<TooltipContent className="rounded-lg">
							{isSearchPage
								? "Back to library"
								: "Search library"}
							<kbd className="ml-2 rounded-md bg-background/20 px-1.5 py-0.5 text-xs font-medium">
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
