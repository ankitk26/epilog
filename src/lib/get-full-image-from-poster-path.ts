export const getFullImageFromPosterPath = (
	posterPath: string | null | undefined,
) => {
	if (!posterPath) {
		return null;
	}

	return `https://image.tmdb.org/t/p/w500${posterPath}`;
};
