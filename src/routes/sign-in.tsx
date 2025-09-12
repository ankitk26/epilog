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
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-6 shadow-sm lg:space-y-8 lg:p-8">
        <div className="space-y-2 text-center lg:space-y-3">
          <h1 className="font-semibold text-2xl text-card-foreground tracking-tight lg:text-3xl">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Sign in to your account to continue
          </p>
        </div>

        <Button
          className="h-11 w-full gap-3 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] lg:h-12"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await authClient.signIn.social({ provider: "google" });
          }}
          variant="outline"
        >
          {isLoading ? (
            <>
              <LoaderIcon className="h-4 w-4 animate-spin lg:h-5 lg:w-5" />
              Signing in...
            </>
          ) : (
            <>
              <svg
                aria-label="Google logo"
                className="icon icon-tabler icons-tabler-filled icon-tabler-brand-google size-5 fill-primary"
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Google</title>
                <path d="M0 0h24v24H0z" fill="none" stroke="none" />
                <path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
              </svg>
              Continue with Google
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
