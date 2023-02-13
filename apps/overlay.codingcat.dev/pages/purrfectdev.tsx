import dynamic from 'next/dynamic';
const PurrfectDev = dynamic(() => import('../components/PurrfectDev'), {
	ssr: false
});

export default function CodingPage() {
	return <PurrfectDev />;
}
