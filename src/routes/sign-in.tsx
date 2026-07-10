import { GoogleLogoIcon, SpinnerIcon } from "@phosphor-icons/react";
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
						What Are You Watching and Reading?
					</p>
				</div>

				<div className="mx-auto w-full max-w-xs space-y-4">
					<Button
						className="w-full"
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
								<GoogleLogoIcon className="size-5" />
								Continue with Google
							</>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
