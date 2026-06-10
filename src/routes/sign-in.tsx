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
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4">
			{/* Decorative background elements */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
				<div className="absolute -bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full bg-accent/30 blur-3xl" />
			</div>

			<div className="relative w-full max-w-sm space-y-8 rounded-2xl border border-border/60 bg-card/80 p-8 shadow-luxury-xl backdrop-blur-sm lg:space-y-10 lg:p-10">
				<div className="space-y-3 text-center">
					<h1
						className="text-3xl font-semibold tracking-tight text-card-foreground lg:text-4xl"
						style={{ fontFamily: "var(--font-heading)" }}
					>
						epilog
					</h1>
					<p className="text-sm leading-relaxed text-muted-foreground">
						Curate your world. Track the stories that move you.
					</p>
				</div>

				<div className="space-y-4">
					<div className="h-px bg-border/60" />

					<Button
						className="h-12 w-full gap-3 rounded-xl border-border/60 font-medium transition-all duration-300 hover:scale-[1.02] hover:bg-accent/50 hover:shadow-luxury active:scale-[0.98]"
						disabled={isLoading}
						onClick={async () => {
							setIsLoading(true);
							await authClient.signIn.social({
								provider: "google",
							});
						}}
						variant="outline"
					>
						{isLoading ? (
							<>
								<SpinnerIcon className="h-4 w-4 animate-spin lg:h-5 lg:w-5" />
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
									<path
										d="M0 0h24v24H0z"
										fill="none"
										stroke="none"
									/>
									<path d="M12 2a9.96 9.96 0 0 1 6.29 2.226a1 1 0 0 1 .04 1.52l-1.51 1.362a1 1 0 0 1 -1.265 .06a6 6 0 1 0 2.103 6.836l.001 -.004h-3.66a1 1 0 0 1 -.992 -.883l-.007 -.117v-2a1 1 0 0 1 1 -1h6.945a1 1 0 0 1 .994 .89c.04 .367 .061 .737 .061 1.11c0 5.523 -4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
								</svg>
								Continue with Google
							</>
						)}
					</Button>
				</div>

				<p className="text-center text-xs text-muted-foreground/60">
					By signing in, you agree to our terms of service.
				</p>
			</div>
		</div>
	);
}
