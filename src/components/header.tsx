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
		<header className="border-b px-4 py-3 lg:px-6 lg:py-4">
			<div className="mx-auto flex max-w-6xl items-center justify-between">
				<Link
					className="font-heading text-lg font-semibold tracking-wide"
					search={defaultMediaFilters}
					to="/"
				>
					epilog
				</Link>

				<div className="flex items-center gap-3">
					<Button
						className="h-8 gap-1.5 text-xs"
						onClick={goToSearch}
						size="sm"
						variant="outline"
					>
						<MagnifyingGlassIcon className="size-3.5" />
						Search
					</Button>

					<ThemeToggle />

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<button
									type="button"
									className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 outline-none select-none"
								>
									<span className="absolute inset-0 rounded-full border border-border mix-blend-darken dark:mix-blend-lighten" />
									<Avatar className="size-8">
										<AvatarImage
											alt={data?.user.name}
											src={data?.user.image ?? ""}
										/>
										<AvatarFallback>
											{data?.user.name[0]}
										</AvatarFallback>
									</Avatar>
								</button>
							}
						/>
						<DropdownMenuContent align="end" className="w-48">
							<div className="px-2 py-1.5">
								<p className="text-sm font-medium">
									{data?.user.name}
								</p>
								<p className="text-xs text-muted-foreground">
									{data?.user.email}
								</p>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignOut}>
								<SignOutIcon className="size-3.5" />
								Log out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
