import { MagnifyingGlassIcon, SignOutIcon } from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { defaultMediaFilters } from "@/lib/media-filters";
import { searchStore } from "@/store/search-store";
import type { MediaType } from "@/types";
import { ThemeToggle } from "./theme-toggler";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
	const navigate = useNavigate();
	const location = useLocation();
	const { data } = authClient.useSession();

	const isHome = location.pathname === "/";
	const homeMediaType = (location.search as { type?: MediaType }).type;

	const goToSearch = () => {
		if (isHome && homeMediaType) {
			searchStore.setState((state) => ({
				...state,
				mediaType: homeMediaType,
			}));
		}
		void navigate({ to: "/search" });
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
		<header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-8">
			<div className="mx-auto flex max-w-6xl items-center justify-between py-3.5 lg:py-4">
				<Link
					className="text-xl font-semibold tracking-tight"
					search={defaultMediaFilters}
					to="/"
					style={{ fontFamily: "var(--font-heading)" }}
				>
					epilog
				</Link>

				<div className="flex items-center gap-2.5">
					<Button
						className="h-9 gap-2 rounded-full border-border/60 px-4 text-xs font-medium tracking-wide text-foreground/80 transition-all hover:bg-accent hover:text-foreground"
						onClick={goToSearch}
						size="sm"
						variant="outline"
					>
						<MagnifyingGlassIcon
							className="size-3.5"
							weight="bold"
						/>
						<span className="hidden sm:inline">Search</span>
					</Button>

					<ThemeToggle />

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<button
									type="button"
									className="relative flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none select-none"
								>
									<span className="absolute inset-0 rounded-full border border-border/60 transition-colors hover:border-ring/50" />
									<Avatar className="size-9">
										<AvatarImage
											alt={data?.user.name}
											src={data?.user.image ?? ""}
										/>
										<AvatarFallback className="bg-secondary text-xs font-medium">
											{data?.user.name[0]}
										</AvatarFallback>
									</Avatar>
								</button>
							}
						/>
						<DropdownMenuContent
							align="end"
							className="w-52 border-border/60 shadow-luxury-lg"
						>
							<div className="px-2.5 py-2">
								<p className="text-sm font-medium">
									{data?.user.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{data?.user.email}
								</p>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignOut}>
								<SignOutIcon
									className="size-3.5"
									weight="bold"
								/>
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
