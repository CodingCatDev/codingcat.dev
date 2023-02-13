import dynamic from 'next/dynamic';
const Coding = dynamic(() => import('../components/Coding'), {
	ssr: false
});

export default function CodingPage() {
	return <Coding />;
}
