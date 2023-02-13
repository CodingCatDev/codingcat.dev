import { createSocketStudioClient } from '@socket-studio/preact';
export const client = createSocketStudioClient(
	process.env.NODE_ENV === 'development'
		? 'http://localhost:9797/graphql'
		: 'https://codingcat-twitch.onrender.com/graphql'
);
