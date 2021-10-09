import { PostType } from '@/models/post.model';
import {
  latestHistory,
  postBySlugService,
  validateAdminUser,
} from '@/services/serversideApi';
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

const preview = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const slugQuery = req.query.slug as string;
  // const secret = req.query.secret as string;

  // Check for a slug
  if (!slugQuery) {
    return res.status(401).json({ message: 'Slug Missing' });
  }

  // Must be an Admin
  // In an normal CMS you might want to check for a token instead.
  const cookies = cookie.parse(req.headers.cookie || '');
  const auth = cookies.auth;
  // Check for user authentication from cookie
  let validUser = true;
  if (auth) {
    const user = JSON.parse(auth) as {
      uid: string;
      email: string;
      token: string;
    };
    validUser = await validateAdminUser(user.token);
  } else {
    validUser = false;
  }

  if (!validUser) {
    return res.status(401).json({ message: 'Must be an admin user' });
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
  const post = posts[0];
  const history = await latestHistory(post.id as string);
  res.setPreviewData({
    id: history?.id,
    postId: history?.postId,
    slug: history?.slug,
  });

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(`/${post.type}/${post.slug}`);
};
export default preview;
