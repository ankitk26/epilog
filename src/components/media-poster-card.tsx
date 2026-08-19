import type { MediaType } from "@/types";
import type { BookProgressData } from "./book-progress";
import LogItem from "./log-item";

type Props = {
	media: {
		imageUrl: string | undefined | null;
		name: string;
		secondaryText?: string | null;
		releaseYear: number | null;
		creator?: string | null;
		sourceId: string;
		type: MediaType;
		seriesName?: string;
		seriesPosition?: number;
		seriesTotal?: number;
		seriesKey?: string;
	};
	onClick?: () => void;
	progress?: BookProgressData | null;
};

export default function MediaPosterCard(props: Props) {
	return (
		<LogItem.Grid
			media={props.media}
			onClick={props.onClick}
			progress={props.progress}
		/>
	);
}
