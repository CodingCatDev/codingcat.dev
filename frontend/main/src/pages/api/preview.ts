import { PostType } from '@/models/post.model';
import { getPostById } from '@/services/sanity.server';
import { NextApiRequest, NextApiResponse } from 'next';

const preview = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const courseType = req.query?.courseType as string;
  const courseSlug = req.query?.courseSlug as string;
  const selectionType = req.query?.selectionType as string;
  const selectionSlug = req.query?.selectionSlug as string;
  const _id = req.query?._id as string;

  console.log('Query: ', JSON.stringify(req.query));

  if (!_id) {
    return res.status(400).json({ message: 'Missing document ID.' });
  }

  // Check for a slug
  if (!selectionType || !selectionSlug) {
    return res.status(400).json({ message: 'Slug Missing.' });
  }

  // If Lesson check for course
  if (selectionType === PostType.lesson && (!courseType || !courseSlug)) {
    return res.status(400).json({ message: 'Slug Missing for Course.' });
  }

  // Must be an Admin
  // if (!validUser) {
  //   return res.status(401).json({ message: 'Must be an admin user' });
  // }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const post = await getPostById({ preview: true, _id });

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(400).json({ message: 'No Doc Found' });
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({
    courseType,
    courseSlug,
    _id,
  });

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  if (post._type === 'lesson') {
    res.redirect(`/${courseType}/${courseSlug}/${post._type}/${post.slug}`);
  } else {
    res.redirect(`/${post._type}/${post.slug}`);
  }
};
export default preview;
