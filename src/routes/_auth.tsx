import Sidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

const authStateFn = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();
  const { userId } = await getAuth(request);

  if (!userId) {
    throw redirect({
      to: "/sign-in/$",
    });
  }

  return { userId };
});

export const Route = createFileRoute("/_auth")({
  component: AuthWrapper,
  beforeLoad: async () => await authStateFn(),
});

function AuthWrapper() {
  return (
    <div className="grid h-screen grid-cols-6">
      <Sidebar />
      <ScrollArea className="col-span-5 h-screen w-full py-6 px-8">
        <Outlet />
      </ScrollArea>
    </div>
  );
}
