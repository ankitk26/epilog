export function standardizePersonName(
	name: string | undefined | null,
): string | null {
	if (!name) return null;

	const parts = name.split(",").map((part) => part.trim());
	if (parts.length === 2 && parts[0] && parts[1]) {
		return `${parts[1]} ${parts[0]}`;
	}

	return name;
}
