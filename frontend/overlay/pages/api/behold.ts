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
				'https://res.cloudinary.com/burtonmedia/video/upload/v1588264596/Behold_My_Bucket_zqw7ft.mp3',
			image:
				'https://res.cloudinary.com/burtonmedia/image/upload/v1588264755/Behold_My_Bucket_th2mya.gif',
			duration: 3
		})
	});
};
export default adult;
