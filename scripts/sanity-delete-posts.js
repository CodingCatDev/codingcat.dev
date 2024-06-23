import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});
const deletPosts = async () => {
  const posts = await client.fetch(
    `*[_type == "podcast"]{
				_id
			  }`
  );
  for (const post of posts) {
    client.delete(post._id);
  }
};
deletPosts();
