import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AppShellHeader from "@/components/app-shell-header";
import { userProfileQueryOptions } from "@/queries/user-profile";

export const Route = createFileRoute("/_auth")({
	component: AuthWrapper,
	beforeLoad: ({ context }) => {
		if (!context.isAuthenticated) {
			throw redirect({ to: "/sign-in" });
		}
	},
	// Prefetch media type preferences so the library and search pages can
	// render the user's customized tabs without any intermediate state.
	loader: ({ context }) => {
		void context.queryClient.ensureQueryData(userProfileQueryOptions);
	},
});

function AuthWrapper() {
	return (
		<div className="relative flex h-dvh flex-col overflow-y-auto bg-background/40">
			<AppShellHeader />
			<main className="relative z-10 flex-1 px-6 pt-24 pb-20 lg:px-12 lg:pt-32 lg:pb-20">
				<div className="mx-auto max-w-5xl">
					<Outlet />
				</div>
			</main>
		</div>
	);
}
