// Ratings use a five star scale with half star steps, so 0.5 to 5.
export const ratingMax = 5;
export const ratingMin = 0.5;
export const ratingStep = 0.5;

export function isValidRating(value: number): boolean {
	if (!Number.isFinite(value)) return false;
	if (value < ratingMin || value > ratingMax) return false;

	const steps = value / ratingStep;
	return Math.abs(steps - Math.round(steps)) < 1e-9;
}
