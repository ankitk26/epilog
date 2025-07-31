import { fetchSession, getCookieName } from "@/lib/sever-auth-utils";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, getWebRequest } from "@tanstack/react-start/server";

export const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
  const sessionCookieName = await getCookieName();
  const token = getCookie(sessionCookieName);
  const request = getWebRequest();
  const { session } = await fetchSession(request);
  return { session, token };
});
