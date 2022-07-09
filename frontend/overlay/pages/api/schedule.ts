import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/utils/createHandler';
import { queryPurrfectStreamByScheduled } from '@/services/notion.server';

const adult = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== 'POST') {
		res.status(405).send('Crazy Cat!');
		return;
	}
	const scheduledRaw = await queryPurrfectStreamByScheduled();

	const messages = scheduledRaw?.results?.map((p) => `${p?.recordingDate}	- ${p.title}`);

	return createHandler({
		req,
		res,
		name: 'schedule',
		description: 'Stream Schedule!',
		handler: () => ({
			message: messages.join(',')
		})
	});
};
export default adult;
