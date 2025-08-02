import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Sidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const Route = createFileRoute("/_auth")({
  component: AuthWrapper,
  beforeLoad: ({ context }) => {
    const userId = context.session?.user;
    const token = context.token;
    if (!(token && userId)) {
      throw redirect({ to: "/sign-in" });
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.mediaLogs.all, {})
    );
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
