import MediaCard, { type MediaCardMedia } from "./media-card";

type Props = {
	media: MediaCardMedia & {
		sourceId: string;
	};
	isLogged?: boolean;
	onClick?: () => void;
};

export default function SearchMediaItem({ isLogged, media, onClick }: Props) {
	return (
		<MediaCard.List media={media} onClick={onClick}>
			{isLogged && <MediaCard.LoggedBadge />}
		</MediaCard.List>
	);
}
