import type { NextPage } from 'next';
import AJPrimary from '../components/AJPrimary';

const Home: NextPage = () => {
	return (
		<main className="grid grid-rows-[1fr_8px_144px] h-screen overflow-hidden">
			<div className="overlay-top h-full w-full" />
			<div className="w-full bg-purple-900 h-2" />
			<div className="w-full bg-gradient-to-r to-purple-700 via-purple-500 from-pink-500 flex justify-end">
				<div className="w-36 h-36 p-2">
					<AJPrimary className="block w-32 h-32" />
				</div>
			</div>
		</main>
	);
};

export default Home;
