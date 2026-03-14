/**
 * X/Twitter social posting service.
 * Posts new video announcements to X/Twitter using the v2 API.
 *
 * Required env vars:
 * - X_API_KEY (consumer key)
 * - X_API_SECRET (consumer secret)
 * - X_ACCESS_TOKEN (user access token)
 * - X_ACCESS_SECRET (user access token secret)
 */

import * as crypto from "node:crypto";

// ---------------------------------------------------------------------------
// OAuth 1.0a signature generation for X API v2
// ---------------------------------------------------------------------------

function percentEncode(str: string): string {
	return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function generateOAuthSignature(
	method: string,
	url: string,
	params: Record<string, string>,
	consumerSecret: string,
	tokenSecret: string,
): string {
	const sortedParams = Object.keys(params)
		.sort()
		.map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
		.join("&");

	const baseString = `${method.toUpperCase()}&${percentEncode(url)}&${percentEncode(sortedParams)}`;
	const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

	return crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
}

function generateOAuthHeader(method: string, url: string, body?: Record<string, string>): string {
	const apiKey = process.env.X_API_KEY;
	const apiSecret = process.env.X_API_SECRET;
	const accessToken = process.env.X_ACCESS_TOKEN;
	const accessSecret = process.env.X_ACCESS_SECRET;

	if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
		throw new Error("X/Twitter API credentials not configured");
	}

	const oauthParams: Record<string, string> = {
		oauth_consumer_key: apiKey,
		oauth_nonce: crypto.randomBytes(16).toString("hex"),
		oauth_signature_method: "HMAC-SHA1",
		oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
		oauth_token: accessToken,
		oauth_version: "1.0",
	};

	const allParams = { ...oauthParams, ...(body || {}) };
	const signature = generateOAuthSignature(method, url, allParams, apiSecret, accessSecret);
	oauthParams.oauth_signature = signature;

	const headerParts = Object.keys(oauthParams)
		.sort()
		.map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
		.join(", ");

	return `OAuth ${headerParts}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface PostTweetOptions {
	text: string;
}

export interface TweetResult {
	success: boolean;
	tweetId?: string;
	tweetUrl?: string;
	error?: string;
}

/**
 * Post a tweet to X/Twitter.
 */
export async function postTweet(opts: PostTweetOptions): Promise<TweetResult> {
	const apiKey = process.env.X_API_KEY;
	if (!apiKey) {
		console.warn("[x-social] X_API_KEY not set — skipping tweet");
		return { success: false, error: "X_API_KEY not configured" };
	}

	const url = "https://api.x.com/2/tweets";

	try {
		const authHeader = generateOAuthHeader("POST", url);

		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: authHeader,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: opts.text }),
		});

		if (!response.ok) {
			const errorBody = await response.text();
			console.error(`[x-social] X API error ${response.status}: ${errorBody}`);
			return { success: false, error: `X API ${response.status}: ${errorBody}` };
		}

		const data = await response.json();
		const tweetId = data.data?.id;

		console.log(`[x-social] Tweet posted: ${tweetId}`);
		return {
			success: true,
			tweetId,
			tweetUrl: tweetId ? `https://x.com/CodingCatDev/status/${tweetId}` : undefined,
		};
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.error(`[x-social] Failed to post tweet: ${msg}`);
		return { success: false, error: msg };
	}
}

/**
 * Generate and post a video announcement tweet.
 * Formats the tweet with title, YouTube URL, and relevant hashtags.
 */
export async function postVideoAnnouncement(opts: {
	videoTitle: string;
	youtubeUrl: string;
	tags?: string[];
}): Promise<TweetResult> {
	// Build hashtags from tags (max 3 to keep tweet clean)
	const hashtags = (opts.tags || [])
		.slice(0, 3)
		.map((t) => `#${t.replace(/\s+/g, "").replace(/^#/, "")}`)
		.join(" ");

	// Format tweet: title + URL + hashtags (max 280 chars)
	const baseText = `🎬 New video: ${opts.videoTitle}\n\n${opts.youtubeUrl}`;
	const withHashtags = hashtags ? `${baseText}\n\n${hashtags} #WebDev #CodingCatDev` : `${baseText}\n\n#WebDev #CodingCatDev`;

	// Trim to 280 chars if needed
	const text = withHashtags.length > 280
		? `${baseText.slice(0, 275)}...`
		: withHashtags;

	return postTweet({ text });
}
