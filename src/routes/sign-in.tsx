import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Button
        onClick={async () =>
          await authClient.signIn.social({ provider: "google" })
        }
      >
        Sign in with Google
      </Button>
    </div>
  );
}
