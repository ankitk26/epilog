import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { authQueryOptions } from "@/queries/auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function SidebarFooter() {
  const navigate = useNavigate();
  const {
    data: { session },
  } = useSuspenseQuery(authQueryOptions);

  return (
    <div className="border-t px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage
              alt={session?.user.name ?? ""}
              src={session?.user.image ?? ""}
            />
            <AvatarFallback>{session?.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-xs">
            <span>{session?.user.name}</span>
            <span className="text-muted-foreground">{session?.user.email}</span>
          </div>
        </div>
        <Button
          className="size-8"
          onClick={async () => {
            await navigate({ to: "/sign-in" });
            await authClient.signOut();
          }}
          size="icon"
          variant="secondary"
        >
          <LogOutIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
