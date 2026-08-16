import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AppShellHeader from "@/components/app-shell-header";

export const Route = createFileRoute("/_auth")({
	component: AuthWrapper,
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/sign-in" });
		}
	},
});

function AuthWrapper() {
	return (
		<div className="relative flex h-dvh flex-col overflow-y-auto bg-canvas/40">
			<AppShellHeader />
			<main className="relative z-10 flex-1 px-6 pt-24 pb-20 lg:px-12 lg:pt-32 lg:pb-20">
				<div className="mx-auto max-w-5xl">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
