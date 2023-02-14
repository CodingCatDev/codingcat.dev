import { NextApiRequest, NextApiResponse } from 'next';

const preview = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  // Must have secret
  if (!process.env.NEXT_PREVIEW_SECRET) {
    return res
      .status(500)
      .json({ message: 'Secret Missing please add NEXT_PREVIEW_SECRET' });
  }

  if (req.query.secret !== process.env.NEXT_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const path = req.query?.path as string;

    await res.revalidate(path);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
};
export default preview;
