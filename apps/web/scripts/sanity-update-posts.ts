/*
 * Run using
 * npx dotenvx run -f .env.local -- npx tsx ./scripts/sanity-update-posts.ts
 */

import { createClient } from "@sanity/client";
import "dotenv/config";

export const client = createClient({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
	useCdn: false,
	token: process.env.SANITY_API_WRITE_TOKEN,
});
const updatePosts = async () => {
	const posts = await client.fetch(
		`*[_type in ["author", "course", "guest", "page", "podcast","post", "sponsor"]]`,
	);
	for (const post of posts) {
		console.log(`Updating ${post.title}`);

		await client
			.patch(post._id)
			.set({ _updatedAt: new Date().toISOString() })
			.commit();
	}
};
updatePosts();
