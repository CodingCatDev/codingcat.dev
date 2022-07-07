import type { NextApiRequest, NextApiResponse } from 'next';
import { createHandler } from '@/utils/createHandler';
const so = (req: NextApiRequest, res: NextApiResponse) => {
	return createHandler({
		req,
		res,
		name: 'so',
		description: 'Send a shout-out to someone in chat! `!so @username`',
		handler: ({ author, args }) => {
			if (
				!author ||
				!author.roles.includes('SUBSCRIBER') ||
				!author.roles.includes('BROADCASTER')
			) {
				return;
			}

			const soTarget = args.find((part) => part.startsWith('@'));
			if (!soTarget) {
				return;
			}

			const twitchLink = `https://twitch.tv/${soTarget.replace('@', '')}`;

			return {
				message: `/announce Please check out ${soTarget} at ${twitchLink} coding41Ajheart`
			};
		}
	});
};
export default so;
