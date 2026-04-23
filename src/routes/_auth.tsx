import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "@/components/header";
import { ScrollArea } from "@/components/ui/scroll-area";

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
		<div className="flex h-screen min-h-0 flex-col overflow-hidden">
			<Header />
			<ScrollArea className="flex-1">
				<div className="px-4 py-4 lg:px-6 lg:py-6">
					<Outlet />
				</div>
			</ScrollArea>
		</div>
	);
}
