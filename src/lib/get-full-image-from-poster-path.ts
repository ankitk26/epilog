export const getFullImageFromPosterPath = (posterPath: string | null) => {
	if (posterPath === null) {
		return null;
	}

	return `https://image.tmdb.org/t/p/w500${posterPath}`;
};
