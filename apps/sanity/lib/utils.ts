/**
 * Extract YouTube video ID from various URL formats
 */
export function youtubeParser(url: string): string | null {
	if (!url || typeof url !== "string") return null;
	const regExp =
		/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);
	return match && match[2].length === 11 ? match[2] : null;
}
