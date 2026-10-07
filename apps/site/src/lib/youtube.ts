/**
 * Extract an 11-character YouTube video id from any of the URL forms the CMS
 * accepts. Ported from the Next app's `youtubeParser`, which returned `false`
 * on no match; this returns undefined so callers can use `??`.
 */
const YOUTUBE_URL =
	/(?:youtu\.be\/|youtube\.com\/(?:live\/|shorts\/|embed\/|v\/|watch\?v=)|u\/\w\/)([^#&?/]+)/;

export function youtubeId(input?: string | null): string | undefined {
	if (!input) {
		return undefined;
	}
	const match = input.match(YOUTUBE_URL);
	const id = match?.[1];
	return id?.length === 11 ? id : undefined;
}
