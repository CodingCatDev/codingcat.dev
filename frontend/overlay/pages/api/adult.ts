import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/utils/createHandler';
const adult = (req: NextApiRequest, res: NextApiResponse) => {
	return createHandler({
		req,
		res,
		name: 'behold',
		description: 'Behold! My Bucket.',
		handler: () => ({
			audio:
				'https://res.cloudinary.com/jlengstorf/video/upload/q_auto/v1569957993/lwj-sfx/adult-supervision.mp3',
			image:
				'https://res.cloudinary.com/jlengstorf/image/upload/q_auto,f_auto,w_400/v1573512575/lwj-sfx/raise-hand',
			duration: 5
		})
	});
};
export default adult;
