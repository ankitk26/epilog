import { api } from "@convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSidebarStore } from "@/store/sidebar-store";

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
  const { setCollapsed } = useSidebarStore();

  // Auto-collapse sidebar on mobile and tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  return (
    <div className="grid h-screen grid-cols-1 overflow-x-hidden lg:grid-cols-6">
      <Sidebar />
      <ScrollArea className="col-span-1 h-screen w-full overflow-x-hidden lg:col-span-5">
        <div className="px-4 py-4 lg:px-6 lg:py-6">
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <Button
              className="h-9 w-9 p-0"
              onClick={() => useSidebarStore.getState().toggle()}
              size="sm"
              variant="outline"
            >
              <MenuIcon className="h-4 w-4" />
            </Button>
            <h1 className="font-semibold text-lg">epilog</h1>
            <div className="h-9 w-9" />
          </div>
          <Outlet />
        </div>
      </ScrollArea>
    </div>
  );
}
