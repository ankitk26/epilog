import { getAuth } from "@clerk/tanstack-react-start/server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

const authStateFn = createServerFn({ method: "GET" }).handler(async () => {
  const request = getWebRequest();
  const { userId } = await getAuth(request);

  console.log(userId);

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
  return <Outlet />;
}
