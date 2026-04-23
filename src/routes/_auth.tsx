import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "@/components/header";

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
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex min-h-0 flex-1 flex-col px-4 py-4 lg:px-6 lg:py-6">
				<Outlet />
			</main>
		</div>
	);
}
