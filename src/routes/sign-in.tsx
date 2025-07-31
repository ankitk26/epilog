import { createFileRoute } from "@tanstack/react-router";
import { LoaderIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-8 rounded-xl border bg-card p-8 shadow-sm">
        <div className="space-y-3 text-center">
          <h1 className="font-semibold text-3xl text-card-foreground tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sign in to your account to continue
          </p>
        </div>

        <Button
          className="h-12 w-full gap-3 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await authClient.signIn.social({ provider: "google" });
          }}
          variant="outline"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="h-5 w-5 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <svg
                className="h-5 w-5"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Google</title>
                <path
                  className="text-foreground"
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
