import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/utils/createHandler';
const adult = (req: NextApiRequest, res: NextApiResponse) => {
	return createHandler({
		req,
		res,
		name: 'jamstack',
		description: "Let's get jazzed!",
		handler: () => ({
			audio:
				'https://res.cloudinary.com/lindakatcodes/video/upload/v1617164412/lwj-commands/Jamstack.mp3',
			image:
				'https://res.cloudinary.com/lindakatcodes/image/upload/v1617163384/lwj-commands/JamstackJazzHands-Gif.gif',
			duration: 3
		})
	});
};
export default adult;
