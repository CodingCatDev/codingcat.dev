import { createSocketStudioClient, SocketStudioProvider } from '@socket-studio/preact';
import AJPrimary from '@/components/AJPrimary';
import { Chat } from '@/components/Chat';
import { TagDrop } from '@/components/TagDrop';

export default function Home() {
	const client = createSocketStudioClient('https://codingcat-twitch.onrender.com/graphql');
	return (
		<SocketStudioProvider client={client}>
			<main className="grid grid-rows-[1fr_8px_144px] h-screen overflow-hidden">
				<div className="w-full h-full overlay-top" />
				<div className="w-full h-2 bg-purple-900" />
				<div className="grid grid-cols-[400px_minmax(500px,_1fr)_140px] w-full bg-gradient-to-r to-purple-700 via-purple-500 from-pink-500">
					<Chat />
					<div></div>
					<div className="p-2 w-36 h-36">
						<AJPrimary className="block w-32 h-32" />
					</div>
				</div>
			</main>
			<TagDrop />
		</SocketStudioProvider>
	);
}
