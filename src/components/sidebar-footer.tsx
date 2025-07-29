import { useClerk, useUser } from "@clerk/tanstack-react-start";
import { LogOutIcon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export default function SidebarFooter() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="px-6 py-4 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="size-8">
            <AvatarImage src={user?.imageUrl} alt={user?.username ?? ""} />
          </Avatar>
          <div className="flex text-xs flex-col">
            <span>{user?.fullName}</span>
            <span className="text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="size-8"
          onClick={async () => await signOut()}
        >
          <LogOutIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
