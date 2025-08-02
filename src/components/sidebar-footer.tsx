import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { authQueryOptions } from "@/queries/auth";
import { useSidebarStore } from "@/store/sidebar-store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function SidebarFooter() {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebarStore();
  const {
    data: { session },
  } = useSuspenseQuery(authQueryOptions);

  return (
    <div className="border-t px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-7 lg:size-8">
            <AvatarImage
              alt={session?.user.name ?? ""}
              src={session?.user.image ?? ""}
            />
            <AvatarFallback>{session?.user.name[0]}</AvatarFallback>
          </Avatar>
          <div
            className={cn("flex flex-col text-xs", isCollapsed && "lg:hidden")}
          >
            <span className="truncate">{session?.user.name}</span>
            <span className="truncate text-muted-foreground">
              {session?.user.email}
            </span>
          </div>
        </div>
        <Button
          className="size-7 lg:size-8"
          onClick={async () => {
            await navigate({ to: "/sign-in" });
            await authClient.signOut();
          }}
          size="icon"
          variant="secondary"
        >
          <LogOutIcon className="size-3 lg:size-4" />
        </Button>
      </div>
    </div>
  );
}
