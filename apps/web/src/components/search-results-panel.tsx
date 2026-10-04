import { convexQuery } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AddMediaToLogDialog from "@/components/add-media-to-log-dialog";
import MediaLogDetailsDialog from "@/components/media-log-details-dialog";
import { useDialogHistory } from "@/hooks/use-dialog-history";
import type { SearchMedia } from "@/hooks/use-media-search";
import type { MediaType } from "@/types";
import SearchResultsList from "./search-results-list";

type Props = {
	query: string;
	type: MediaType;
};

export default function SearchResultsPanel({ query, type }: Props) {
	const [selectedMedia, setSelectedMedia] = useState<SearchMedia | null>(
		null,
	);

	useDialogHistory(
		!!selectedMedia,
		() => setSelectedMedia(null),
		"search-media-dialog",
	);

	const { data: existingLog } = useQuery({
		...convexQuery(api.logs.getBySourceMediaId, {
			sourceMediaId: selectedMedia?.sourceId ?? "",
		}),
		enabled: !!selectedMedia,
	});

	return (
		<div>
			<SearchResultsList
				onMediaClick={setSelectedMedia}
				query={query}
				type={type}
			/>

			{existingLog ? (
				<MediaLogDetailsDialog
					log={existingLog}
					open={!!selectedMedia}
					onOpenChange={(open) => {
						if (!open) setSelectedMedia(null);
					}}
				/>
			) : (
				<AddMediaToLogDialog
					media={selectedMedia}
					open={!!selectedMedia}
					onOpenChange={(open) => {
						if (!open) setSelectedMedia(null);
					}}
				/>
			)}
		</div>
	);
}
