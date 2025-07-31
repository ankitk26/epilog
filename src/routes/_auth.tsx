import Sidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: AuthWrapper,
  beforeLoad: async ({ context }) => {
    const userId = context.session?.user;
    if (!userId) {
      throw redirect({ to: "/sign-in" });
    }
  },
});

function AuthWrapper() {
  return (
    <div className="grid h-screen grid-cols-6">
      <Sidebar />
      <ScrollArea className="col-span-5 h-screen w-full">
        <div className="px-8 py-6">
          <Outlet />
        </div>
      </ScrollArea>
    </div>
  );
}
