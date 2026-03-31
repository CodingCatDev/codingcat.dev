/**
 * Extract YouTube video ID from various URL formats
 */
export function youtubeParser(url: string): string | null {
	if (!url || typeof url !== "string") return null;
	const trimmed = url.trim();
	if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
	const regExp =
		/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = trimmed.match(regExp);
	return match && match[2].length === 11 ? match[2] : null;
}
