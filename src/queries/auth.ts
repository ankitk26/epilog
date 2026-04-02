import { getAuth } from "@/actions/get-auth";
import { queryOptions } from "@tanstack/react-query";

export const authQueryOptions = queryOptions({
	queryKey: ["auth"],
	queryFn: () => getAuth(),
	staleTime: 1000 * 60 * 15, // 15 minutes
});
