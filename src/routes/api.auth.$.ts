import { reactStartHandler } from "@/lib/sever-auth-utils";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/auth/$").methods({
  GET: ({ request }) => {
    return reactStartHandler(request);
  },
  POST: ({ request }) => {
    return reactStartHandler(request);
  },
});
