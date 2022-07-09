import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/utils/createHandler';
const behold = (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.status(405).send('Crazy Cat!');
		return;
	}
	return createHandler({
		req,
		res,
		name: 'omg',
		description: 'OMG!',
		handler: () => ({
			audio: 'https://media.codingcat.dev/video/upload/f_mp3/main-codingcatdev-video/omg.mp3',
			image:
				'https://media.codingcat.dev/video/upload/fl_lossy,q_10,c_crop,w_0.8,h_0.8,f_gif,e_loop/main-codingcatdev-video/omg.gif',
			duration: 3
		})
	});
};
export default behold;
