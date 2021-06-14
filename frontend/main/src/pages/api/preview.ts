import { PostType } from '@/models/post.model';
import { postBySlugService } from '@/services/serversideApi';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const slugQuery = req.query.slug as string;
  const secret = req.query.secret as string;
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (secret !== process.env.NEXT_PREVIEW_TOKEN || !slugQuery) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const slugParts = slugQuery.split('/');

  if (slugParts.length < 2) {
    return res
      .status(401)
      .json({ message: 'Invalid slug parts, should contain type and slug' });
  }

  const allowedTypes = [
    PostType.post,
    PostType.podcast,
    PostType.tutorial,
    PostType.page,
  ];

  let type = slugParts[0] as PostType;
  if (!allowedTypes.includes(type)) {
    type = slugParts[1] as PostType;
  }

  if (!allowedTypes.includes(type)) {
    return res.status(401).json({ message: 'Invalid post type' });
  }

  const slug = slugParts[slugParts.length - 1];

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const posts = await postBySlugService(type, slug);

  // If the slug doesn't exist prevent preview mode from being enabled
  if (posts.length == 0) {
    return res.status(401).json({ message: 'Invalid slug' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({});

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  const post = posts[0];
  res.redirect(`/${post.type}/${post.slug}`);
};
