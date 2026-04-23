import { Link, useNavigate } from "@tanstack/react-router";
import { SearchIcon, LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
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
	const { data } = authClient.useSession();

	return (
		<header className="flex items-center justify-between border-b px-4 py-3 lg:px-6 lg:py-4">
			<Link className="text-lg font-semibold tracking-wide" to="/">
				epilog
			</Link>

			<div className="flex items-center gap-3">
				<Link to="/search">
					<Button
						className="h-8 gap-1.5 text-xs"
						size="sm"
						variant="outline"
					>
						<SearchIcon className="size-3.5" />
						Search
					</Button>
				</Link>

				<ThemeToggle />

				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<div className="relative flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken dark:after:mix-blend-lighten">
								<Avatar className="size-8">
									<AvatarImage
										alt={data?.user.name}
										src={data?.user.image ?? ""}
									/>
									<AvatarFallback>
										{data?.user.name[0]}
									</AvatarFallback>
								</Avatar>
							</div>
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
						<DropdownMenuItem
							onClick={async () => {
								await navigate({ to: "/sign-in" });
								await authClient.signOut({
									fetchOptions: {
										onSuccess: () => {
											location.reload();
										},
									},
								});
							}}
						>
							<LogOutIcon className="size-3.5" />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
