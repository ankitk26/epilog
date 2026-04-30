export const getReleaseYear = (
	release_date: string | null | undefined,
	first_air_date: string | null | undefined,
) => {
	let releaseYear: number | null = null;
	if (release_date) {
		releaseYear = new Date(release_date).getFullYear();
	} else if (first_air_date) {
		releaseYear = new Date(first_air_date).getFullYear();
	}

	return releaseYear;
};
