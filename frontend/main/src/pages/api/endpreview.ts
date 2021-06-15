import { NextApiRequest, NextApiResponse } from 'next';
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  // Clears the preview mode cookies.
  // This function accepts no arguments.
  res.clearPreviewData();
  return res.status(200).json({ message: 'Cleared' });
}
