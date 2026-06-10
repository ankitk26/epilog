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
			<main className="flex-1 px-4 py-5 lg:px-8 lg:py-8">
				<div className="mx-auto max-w-6xl">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
