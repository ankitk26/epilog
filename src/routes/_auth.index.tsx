import { Button } from "@/components/ui/button";
import {
  SignOutButton,
  UserButton,
  UserProfile,
} from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/")({
  component: Home,
});

function Home() {
  return (
    <>
      <UserButton />
      <Button asChild>
        <SignOutButton />
      </Button>
    </>
  );
}
