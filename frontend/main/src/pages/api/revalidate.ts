import { NextApiRequest, NextApiResponse } from 'next';

const preview = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Must have secret
  if (!process.env.SANITY_PREVIEW_SECRET) {
    return res
      .status(401)
      .json({ message: 'Secret Missing please add SANITY_PREVIEW_SECRET' });
  }

  try {
    const path = req.query?.path as string;

    await res.unstable_revalidate(path);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
};
export default preview;
