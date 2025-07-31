import { authClient } from "@/lib/auth-client";
import { authQueryOptions } from "@/queries/auth";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function SidebarFooter() {
  const navigate = useNavigate();
  const {
    data: { session },
  } = useSuspenseQuery(authQueryOptions);

  return (
    <div className="px-6 py-4 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              src={session?.user.image ?? ""}
              alt={session?.user.name ?? ""}
            />
          </Avatar>
          <div className="flex text-xs flex-col">
            <span>{session?.user.name}</span>
            <span className="text-muted-foreground">{session?.user.email}</span>
          </div>
        </div>
          <Button
            size="icon"
            variant="secondary"
            className="size-8"
            onClick={async () => {
              await authClient.signOut();
              navigate({ to: "/sign-in" });
            }}
          >
            <LogOutIcon className="size-4" />
          </Button>
      </div>
    </div>
  );
}
