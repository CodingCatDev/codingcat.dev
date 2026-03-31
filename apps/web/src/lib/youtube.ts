/**
 * YouTube embed helpers.
 *
 * Error 153 ("Video player configuration error") happens when the embed request sends no
 * Referer — e.g. site-wide Referrer-Policy: same-origin. Set
 * referrerpolicy="strict-origin-when-cross-origin" on the iframe.
 * @see https://developers.google.com/youtube/terms/required-minimum-functionality#embedded-player-api-client-identity
 */

/** 11-char video ID from a bare id or youtu.be / watch / embed URLs */
export function parseYoutubeVideoId(input: string | null | undefined): string | null {
  if (!input || typeof input !== "string") return null;
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/** Privacy-enhanced host; works better with some referrer/CSP setups than www.youtube.com */
export function youtubeEmbedSrc(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
}
