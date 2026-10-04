import {
	GearIcon,
	MagnifyingGlassIcon,
	SignOutIcon,
} from "@phosphor-icons/react";
import { formatForDisplay, useHotkey } from "@tanstack/react-hotkeys";
import { Link, useNavigate } from "@tanstack/react-router";
import { useSearchSheet } from "@/components/search-sheet";
import { authClient } from "@/lib/auth-client";
import { defaultMediaFilters } from "@/lib/media-filters";
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

export default function AppShellHeader() {
	const navigate = useNavigate();
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
		<header className="fixed top-0 right-0 left-0 z-30 border-b border-border bg-background px-6 pt-[env(safe-area-inset-top)] lg:px-12">
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
