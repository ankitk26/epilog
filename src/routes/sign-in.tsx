import { SpinnerIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/sign-in")({
	component: SignInPage,
});

function SignInPage() {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-canvas px-6 py-14">
			<div className="relative w-full max-w-md animate-reveal-up space-y-10 text-center">
				<div className="space-y-4">
					<h1 className="font-heading text-6xl font-medium text-foreground lg:text-7xl">
						epilog
					</h1>
					<p className="mx-auto max-w-xs text-sm leading-relaxed text-body">
						Track every story that moves you.
					</p>
				</div>

				<div className="mx-auto w-full max-w-xs space-y-4">
					<Button
						className="w-full gap-3 text-sm font-semibold tracking-wide active:scale-[0.99]"
						size="lg"
						disabled={isLoading}
						onClick={async () => {
							setIsLoading(true);
							await authClient.signIn.social({
								provider: "google",
							});
						}}
					>
						{isLoading ? (
							<>
								<SpinnerIcon className="size-5 animate-spin" />
								Signing in…
							</>
						) : (
							<>
								<svg
									aria-label="Google logo"
									className="size-5"
									role="img"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<title>Google</title>
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
										fill="#EA4335"
									/>
								</svg>
								Continue with Google
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
