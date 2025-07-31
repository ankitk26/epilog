import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Sidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/_auth")({
  component: AuthWrapper,
  beforeLoad: ({ context }) => {
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
