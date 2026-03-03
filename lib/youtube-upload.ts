import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
	process.env.YOUTUBE_CLIENT_ID,
	process.env.YOUTUBE_CLIENT_SECRET,
);
oauth2Client.setCredentials({
	refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

const youtube = google.youtube({ version: "v3", auth: oauth2Client });

interface UploadOptions {
	title: string;
	description: string;
	tags: string[];
	videoUrl: string;
	categoryId?: string;
	privacyStatus?: "public" | "private" | "unlisted";
	madeForKids?: boolean;
}

/**
 * Upload a video to YouTube (main channel video, 16:9).
 */
export async function uploadVideo(opts: UploadOptions): Promise<{ videoId: string; url: string }> {
	const response = await fetch(opts.videoUrl);
	if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);

	const res = await youtube.videos.insert({
		part: ["snippet", "status"],
		requestBody: {
			snippet: {
				title: opts.title.slice(0, 100),
				description: opts.description,
				tags: opts.tags,
				categoryId: opts.categoryId || "28", // Science & Technology
				defaultLanguage: "en",
			},
			status: {
				privacyStatus: opts.privacyStatus || "public",
				selfDeclaredMadeForKids: opts.madeForKids ?? false,
			},
		},
		media: {
			body: response.body as unknown as NodeJS.ReadableStream,
		},
	});

	const videoId = res.data.id || "";
	return { videoId, url: `https://youtube.com/watch?v=${videoId}` };
}

/**
 * Upload a Short to YouTube (9:16 vertical).
 * Shorts have different metadata optimization:
 * - Title must include #Shorts
 * - Shorter, punchier title (max 60 chars before #Shorts)
 * - Description is minimal — hashtags and hook only
 * - Tags focus on trending/discovery terms
 */
export async function uploadShort(opts: UploadOptions): Promise<{ videoId: string; url: string }> {
	// Optimize title for Shorts: shorter, punchier, with #Shorts tag
	const shortTitle = opts.title.length > 60
		? `${opts.title.slice(0, 57)}... #Shorts`
		: `${opts.title} #Shorts`;

	// Shorts description: hook + hashtags only (viewers rarely read full descriptions)
	const hookLine = opts.description.split("\n")[0] || opts.title;
	const hashTags = opts.tags
		.slice(0, 5)
		.map((t) => `#${t.replace(/\s+/g, "").replace(/^#/, "")}`)
		.join(" ");
	const shortDescription = `${hookLine}\n\n${hashTags}\n\n#Shorts #CodingCatDev #Programming`;

	// Shorts-specific tags: add trending discovery terms
	const shortTags = [
		...opts.tags.slice(0, 10),
		"Shorts",
		"Programming Shorts",
		"Dev Tips",
		"Coding Tips",
		"CodingCat",
	];

	return uploadVideo({
		...opts,
		title: shortTitle,
		description: shortDescription,
		tags: [...new Set(shortTags)].slice(0, 15),
	});
}

/**
 * Generate Shorts-optimized metadata using Gemini.
 * Called separately from the main video metadata generator
 * because Shorts have very different SEO patterns.
 */
export async function generateShortsMetadata(
	generateWithGemini: (prompt: string) => Promise<string>,
	doc: { title: string; script?: { hook?: string } },
): Promise<{ title: string; description: string; tags: string[] }> {
	const hook = doc.script?.hook || doc.title;

	const prompt = `You are a YouTube Shorts SEO expert for CodingCat.dev (developer education).

Video hook: ${hook}
Original title: ${doc.title}

Generate metadata optimized specifically for YouTube Shorts (NOT long-form):
- Shorts titles should be punchy, curiosity-driven, max 50 chars (before #Shorts)
- Use patterns like "Did you know...", "This one trick...", "Stop doing this..."
- Description should be 1-2 lines max + hashtags
- Tags should focus on trending/discovery terms

Return JSON: {"title": "punchy title", "description": "short hook + hashtags", "tags": ["trending", "discovery", "terms"]}`;

	const raw = await generateWithGemini(prompt);
	try {
		const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
		return {
			title: (parsed.title?.slice(0, 50) || doc.title) + " #Shorts",
			description: parsed.description || hook,
			tags: Array.isArray(parsed.tags) ? [...parsed.tags.slice(0, 10), "Shorts", "CodingCat"] : ["Shorts"],
		};
	} catch {
		return {
			title: `${doc.title.slice(0, 50)} #Shorts`,
			description: `${hook}\n\n#Shorts #CodingCatDev #Programming`,
			tags: ["Shorts", "Programming", "CodingCat"],
		};
	}
}
