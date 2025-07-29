import { Button } from "@/components/ui/button";
import { useSignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in/")({
  component: SignInPage,
});

function SignInPage() {
  const { signIn } = useSignIn();

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Button
        onClick={() =>
          signIn?.authenticateWithRedirect({
            strategy: "oauth_google",
            redirectUrl: "/sign-in/sso-callback",
            redirectUrlComplete: "/",
          })
        }
      >
        Sign in with Google
      </Button>
    </div>
  );
}
