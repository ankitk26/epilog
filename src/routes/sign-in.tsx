import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
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
