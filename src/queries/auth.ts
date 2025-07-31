import { fetchAuth } from "@/actions/fetch-auth";
import { queryOptions } from "@tanstack/react-query";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: () => fetchAuth(),
  staleTime: 1000 * 60 * 15, // 15 minutes
});
