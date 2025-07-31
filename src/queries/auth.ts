import { queryOptions } from "@tanstack/react-query";
import { fetchAuth } from "@/actions/fetch-auth";

export const authQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: () => fetchAuth(),
  staleTime: 1000 * 60 * 15, // 15 minutes
});
