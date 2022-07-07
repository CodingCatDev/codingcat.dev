import { createSocketStudioClient, SocketStudioProvider } from '@socket-studio/preact';
import AJPrimary from '@/components/AJPrimary';
import LowerThird from './LowerThird';
import Layout from './Layout';
import SideChat from './SideChat';

console.log(process.env);

export default function Coding() {
	const client = createSocketStudioClient('https://codingcat-twitch.onrender.com/graphql');
	return (
		<SocketStudioProvider client={client}>
			<Layout>
				<main className="grid grid-cols-[1fr_180px] w-full">
					<section className="grid grid-rows-[1fr_8px_92px] h-screen overflow-hidden">
						<div />
						<div className="w-full h-2 bg-purple-900" />
						<div className="grid grid-cols-[1fr_100px] w-full bg-gradient-to-r to-purple-700 via-purple-500 from-pink-500">
							<div className="flex items-center justify-center">
								<LowerThird />
							</div>
							<div className="p-1">
								<AJPrimary className="block w-20 h-20" />
							</div>
						</div>
					</section>
					<SideChat />
				</main>
			</Layout>
		</SocketStudioProvider>
	);
}
