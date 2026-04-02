import { createServerFn } from "@tanstack/react-start";
import { getToken } from "@/lib/auth-server";

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
	const token = await getToken();
	return token;
});
