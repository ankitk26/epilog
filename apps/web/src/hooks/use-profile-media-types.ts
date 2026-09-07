import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { userProfileQueryOptions } from "@/queries/user-profile";
import { mediaTypes } from "@/types";

// Non-suspense on purpose: callers render skeleton pills until isReady
// instead of holding the page. Falls back to every media type while the
// profile has not loaded yet or was never customized.
export function useProfileMediaTypes() {
	const { data, isPending } = useQuery(userProfileQueryOptions);

	const enabled = useMemo(
		() =>
			data
				? mediaTypes.filter((type) => data.mediaTypes.includes(type))
				: [...mediaTypes],
		[data],
	);

	return { enabled, isReady: !isPending };
}
