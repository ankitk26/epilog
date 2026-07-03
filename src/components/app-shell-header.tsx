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

	useHotkey("Mod+K", (event) => {
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
		<header className="sticky top-0 z-30 border-b border-hairline bg-canvas/70 backdrop-blur-md supports-backdrop-filter:bg-canvas/55">
			<div className="mx-auto flex h-16 max-w-[88rem] items-center justify-between px-6 lg:h-[4.5rem] lg:px-12">
				<Link
					className="group flex items-baseline"
					search={defaultMediaFilters}
					to="/"
				>
					<span className="font-heading text-2xl font-light tracking-tight text-ink transition-opacity group-hover:opacity-70">
						epilog
					</span>
				</Link>

				<div className="flex items-center gap-2 sm:gap-3">
					<Tooltip>
						<TooltipTrigger
							render={
								<Button
									aria-label="Search library"
									className="size-9 rounded-full border-hairline-strong bg-transparent text-ink transition-colors hover:bg-secondary"
									onClick={openAddLibrarySheet}
									size="icon-sm"
									variant="outline"
								>
									<MagnifyingGlassIcon className="size-4" />
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
								<button
									type="button"
									className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-hairline-strong bg-transparent p-0 transition-colors outline-none hover:bg-secondary"
								>
									<Avatar className="size-9 rounded-full">
										<AvatarImage
											alt={data?.user.name}
											src={data?.user.image ?? ""}
										/>
										<AvatarFallback className="rounded-full bg-secondary text-sm font-medium text-ink">
											{data?.user.name[0]}
										</AvatarFallback>
									</Avatar>
								</button>
							}
						/>
						<DropdownMenuContent
							align="end"
							className="w-52 rounded-xl border-hairline shadow-soft"
						>
							<div className="px-3 py-2">
								<p className="font-heading text-base font-normal text-ink">
									{data?.user.name}
								</p>
								<p className="mt-1 text-xs text-muted-foreground">
									{data?.user.email}
								</p>
							</div>
							<DropdownMenuSeparator className="bg-hairline" />
							<DropdownMenuItem
								className="rounded-lg text-sm focus:bg-secondary"
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
