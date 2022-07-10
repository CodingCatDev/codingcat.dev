import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/utils/createHandler';
const adult = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.status(405).send('Crazy Cat!');
		return;
	}
	return createHandler({
		req,
		res,
		name: 'jamstack',
		description: "Let's get jazzed!",
		handler: () => ({
			audio:
				'https://res.cloudinary.com/lindakatcodes/video/upload/f_mp3/lwj-commands/Jamstack.mp3',
			image:
				'https://res.cloudinary.com/lindakatcodes/image/upload/fl_lossy,q_10,c_fit,w_0.8,h_0.3,f_gif,e_loop/lwj-commands/JamstackJazzHands-Gif.gif',
			duration: 3
		})
	});
};
export default adult;
