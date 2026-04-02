import { getToken } from "@/lib/auth-server";
import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
	const token = await getToken();
	return token;
});
