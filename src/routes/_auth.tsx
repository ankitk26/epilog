import Sidebar from "@/components/sidebar";
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
  component: RouteComponent,
  beforeLoad: async () => await authStateFn(),
});

function RouteComponent() {
  return (
    <div className="grid h-screen grid-cols-6">
      <Sidebar />
      <main className="col-span-5">
        <Outlet />
      </main>
    </div>
  );
}
