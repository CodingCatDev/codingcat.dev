import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/utils/createHandler';
const behold = (req: NextApiRequest, res: NextApiResponse) => {
	return createHandler({
		req,
		res,
		name: 'yes',
		description: 'Yes! Yes I did!',
		handler: () => ({
			audio: 'https://media.codingcat.dev/video/upload/f_mp3/main-codingcatdev-video/yes.mp3',
			image:
				'https://media.codingcat.dev/video/upload/fl_lossy,q_10,c_crop,w_0.8,h_0.8,f_gif/main-codingcatdev-video/yes.gif',
			duration: 3
		})
	});
};
export default behold;
