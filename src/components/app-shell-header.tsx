import { MagnifyingGlassIcon, SignOutIcon } from "@phosphor-icons/react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAddLibrarySheet } from "@/components/add-library-sheet";
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
	const { open: openAddLibrarySheet } = useAddLibrarySheet();

	useHotkey("Mod+K", () => {
		openAddLibrarySheet();
	});

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
		<header className="fixed top-0 right-0 left-0 z-30 bg-canvas/80 px-6 backdrop-blur-md backdrop-saturate-150 lg:px-12">
			<div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between lg:h-20">
				<Link
					className="group flex items-baseline"
					search={defaultMediaFilters}
					to="/"
				>
					<span className="font-heading text-sm font-semibold tracking-[0.15em] text-ink uppercase transition-opacity group-hover:opacity-60">
						epilog
					</span>
				</Link>

				<div className="flex items-center gap-2 sm:gap-3">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Search library"
									onClick={openAddLibrarySheet}
									size="icon"
									variant="outline"
								>
									<MagnifyingGlassIcon />
								</Button>
							}
						/>
						<TooltipContent>
							Search library
							<kbd className="ml-2 rounded-sm bg-background/20 px-1.5 py-0.5 text-[10px] font-medium">
								Mod+K
							</kbd>
						</TooltipContent>
					</Tooltip>

					<ThemeModeToggle />

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									className="overflow-hidden p-0"
									size="icon"
									variant="outline"
								>
									<Avatar
										className="rounded-2xl after:rounded-2xl *:rounded-2xl"
									>
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
						<DropdownMenuContent
							align="end"
							className="w-52"
						>
							<div className="px-3 py-2">
								<p className="font-heading text-sm font-medium text-ink">
									{data?.user.name}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{data?.user.email}
								</p>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className="text-sm"
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
