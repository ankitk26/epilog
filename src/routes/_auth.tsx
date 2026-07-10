import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AddLibrarySheetProvider } from "@/components/add-library-sheet";
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
		<AddLibrarySheetProvider>
			<div className="relative flex min-h-screen flex-col">
				<AppShellHeader />
				<main className="relative z-10 flex-1 px-6 pt-24 pb-14 lg:px-12 lg:pt-32 lg:pb-20">
					<div className="mx-auto max-w-[88rem]">
						<Outlet />
					</div>
				</main>
			</div>
		</AddLibrarySheetProvider>
	);
}
