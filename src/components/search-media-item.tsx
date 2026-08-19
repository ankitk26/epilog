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
		<>
			<div className="lg:hidden">
				<MediaCard.List media={media} onClick={onClick}>
					<MediaCard.Series media={media} />
					{isLogged && <MediaCard.LoggedBadge />}
				</MediaCard.List>
			</div>
			<div className="hidden lg:block">
				<MediaCard.Grid media={media} onClick={onClick}>
					<MediaCard.Series media={media} />
					{isLogged && <MediaCard.LoggedBadge />}
				</MediaCard.Grid>
			</div>
		</>
	);
}
