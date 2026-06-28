import { MagnifyingGlassIcon, SignOutIcon } from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { defaultMediaFilters } from "@/lib/media-filters";
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

export default function AppShellHeader() {
	const navigate = useNavigate();
	const location = useLocation();
	const { data } = authClient.useSession();

	const isHome = location.pathname === "/";
	const homeMediaType = (location.search as { type?: MediaType }).type;

	const goToSearch = () => {
		void navigate({
			to: "/search",
			search:
				isHome && homeMediaType ? { type: homeMediaType } : undefined,
		});
	};

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
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-[4.5rem] lg:px-8">
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
					<Button
						aria-label="Search"
						className="h-9 rounded-full border-hairline-strong bg-transparent px-2.5 text-[13px] font-medium tracking-wide text-ink transition-colors hover:bg-secondary sm:px-4"
						onClick={goToSearch}
						size="sm"
						variant="outline"
					>
						<MagnifyingGlassIcon className="size-4" />
						<span className="hidden sm:inline">Search</span>
					</Button>

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
										<AvatarFallback className="rounded-full bg-secondary text-[13px] font-medium text-ink">
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
							<div className="px-2.5 py-2">
								<p className="font-heading text-[15px] font-normal text-ink">
									{data?.user.name}
								</p>
								<p className="mt-0.5 text-xs text-muted-foreground">
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
