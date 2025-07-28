import { useUser } from "@clerk/tanstack-react-start";
import { Avatar, AvatarImage } from "./ui/avatar";

export default function SidebarFooter() {
  const { user } = useUser();

  return (
    <div className="px-6 py-4 border-t">
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
    </div>
  );
}
