import { createSocketStudioClient, SocketStudioProvider } from '@socket-studio/preact';
import { useState } from 'react';
import AJPrimary from './AJPrimary';
import { Chat } from './Chat';

export default function Home() {
	const client = createSocketStudioClient('https://codingcat-twitch.onrender.com/graphql');
	const [isBrowser] = useState(typeof window !== 'undefined');

	return (
		<SocketStudioProvider client={client}>
			<main className="grid grid-rows-[1fr_8px_144px] h-screen overflow-hidden">
				<div className="overlay-top h-full w-full" />
				<div className="w-full bg-purple-900 h-2" />
				<div className="grid grid-cols-[400px_minmax(500px,_1fr)_140px] w-full bg-gradient-to-r to-purple-700 via-purple-500 from-pink-500">
					<Chat />
					<div></div>
					<div className="w-36 h-36 p-2">
						<AJPrimary className="block w-32 h-32" />
					</div>
				</div>
			</main>
		</SocketStudioProvider>
	);
}
