import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
	process.env.YOUTUBE_CLIENT_ID,
	process.env.YOUTUBE_CLIENT_SECRET,
);
oauth2Client.setCredentials({
	refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
});

const youtube = google.youtube({ version: "v3", auth: oauth2Client });

/**
 * Upload a video to YouTube (main channel video, 16:9).
 */
export async function uploadVideo(opts: {
	title: string;
	description: string;
	tags: string[];
	videoUrl: string;
}): Promise<{ videoId: string; url: string }> {
	// Fetch the video from GCS URL
	const response = await fetch(opts.videoUrl);
	if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);

	const res = await youtube.videos.insert({
		part: ["snippet", "status"],
		requestBody: {
			snippet: {
				title: opts.title,
				description: opts.description,
				tags: opts.tags,
				categoryId: "28", // Science & Technology
			},
			status: {
				privacyStatus: "public",
				selfDeclaredMadeForKids: false,
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
 */
export async function uploadShort(opts: {
	title: string;
	description: string;
	tags: string[];
	videoUrl: string;
}): Promise<{ videoId: string; url: string }> {
	// Shorts are just regular uploads with #Shorts in title/description
	return uploadVideo({
		...opts,
		title: `${opts.title} #Shorts`,
		description: `${opts.description}\n\n#Shorts`,
	});
}
