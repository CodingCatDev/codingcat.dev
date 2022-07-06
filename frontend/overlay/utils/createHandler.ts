import { NextApiRequest, NextApiResponse } from 'next';

type Role = 'SUBSCRIBER' | 'MODERATOR' | 'BROADCASTER';

interface Author {
	id: string;
	username: string;
	roles: Role[];
}

interface Effect {
	message?: string;
	audio?: string;
	image?: string;
	duration?: number;
}

interface EffectDefinition {
	req: NextApiRequest;
	res: NextApiResponse;
	name: string;
	description?: string;
	handler: (commandData: {
		message: string;
		command: string;
		args: string[];
		author: Author;
		extra: { channel: string };
	}) => Effect;
}

export const createHandler = ({ req, res, name, description, handler }: EffectDefinition) => {
	console.log('body:', req.body);
	const { message, command, args, author, extra } = JSON.parse(req.body);

	console.log({
		name,
		description,
		handler,
		message,
		command,
		args,
		author,
		extra
	});

	let response;
	try {
		response = handler({
			message,
			command,
			args,
			author,
			extra
		});
	} catch (error) {
		/*
		 * Some effects have custom logic and return early, which means this
		 * destructuring might fail. We don’t want to actually fail the function,
		 * though, so we can just return an empty response, which effectively
		 * noops the effect without breaking anything.
		 */
		response = {};
	}

	console.log({ response });

	return res
		.status(200)
		.setHeader('Access-Control-Allow-Origin', '*')
		.json({
			name,
			description,
			...response,
			channel: extra.channel
		});
};
