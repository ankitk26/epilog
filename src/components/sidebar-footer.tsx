import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/store/sidebar-store";
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function SidebarFooter() {
	const navigate = useNavigate();
	const { isCollapsed } = useSidebarStore();
	const { data } = authClient.useSession();

	return (
		<div className="border-t px-4 py-3 lg:px-6 lg:py-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Avatar className="size-7 lg:size-8">
						<AvatarImage
							alt={data?.user.name}
							src={data?.user.image ?? ""}
						/>
						<AvatarFallback>{data?.user.name[0]}</AvatarFallback>
					</Avatar>

					{/* Name and email */}
					<div
						className={cn(
							"flex flex-col text-xs",
							isCollapsed && "lg:hidden",
						)}
					>
						<span className="truncate">{data?.user.name}</span>
						<span className="truncate text-muted-foreground">
							{data?.user.email}
						</span>
					</div>
				</div>

				{/* Logout button */}
				<Button
					className="size-7 lg:size-8"
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
					size="icon"
					variant="outline"
				>
					<LogOutIcon className="size-3 lg:size-4" />
				</Button>
			</div>
		</div>
	);
}
