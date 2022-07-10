import { useFirebaseApp, useFirestore, useFirestoreDocData } from 'reactfire';
import { doc, DocumentReference, getFirestore } from 'firebase/firestore';

export default function LowerThird() {
	const app = useFirebaseApp();
	const firestore = getFirestore(app);

	const ref = doc(firestore, 'overlays/alex') as unknown as DocumentReference<any>;
	const { status, data: overlay, error } = useFirestoreDocData(ref);
	return (
		<>
			<section className="flex flex-col">
				{status === 'loading' && <>Loading...</>}
				{status === 'success' && overlay && (
					<>
						<>{overlay?.title && <div className="text-4xl text-purple-50">{overlay.title}</div>}</>
						<>
							{overlay?.subtitle && (
								<div
									className="text-xl text-purple-50"
									dangerouslySetInnerHTML={{ __html: overlay.subtitle }}
								></div>
							)}
						</>
					</>
				)}
			</section>
		</>
	);
}
