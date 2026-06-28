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
		<div className="relative flex min-h-screen flex-col">
			<AppShellHeader />
			<main className="relative z-10 flex-1 py-8 lg:py-12">
				<div className="mx-auto max-w-7xl px-5 lg:px-8">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
