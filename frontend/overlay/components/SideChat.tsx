import { useFirebaseApp, useFirestoreDocData } from 'reactfire';
import { doc, DocumentReference, getFirestore } from 'firebase/firestore';
import { Chat } from './Chat';
import { useRouter } from 'next/router';

export default function SideChat() {
	const app = useFirebaseApp();
	const firestore = getFirestore(app);

	const ref = doc(firestore, 'overlays/alex') as unknown as DocumentReference<any>;
	const { status, data: overlay, error } = useFirestoreDocData(ref);

	const getClass = (length: number) => {
		return `code-author-${length}`;
	};

	const router = useRouter();

	const { hidePeople } = router?.query;

	const chat = () => (
		<div className="bg-purple-700 text-purple-50">
			<div className="relative h-full overflow-hidden">
				<ul className="absolute bottom-0 left-0 pt-0 pb-2 pl-2 pr-5 m-0 list-none">
					<Chat chatMessageClass="p-[1px] grid text-xs gap-1 grid-row-[1fr]" />
				</ul>
			</div>
		</div>
	);

	return (
		<>
			{status === 'loading' && <>Loading...</>}
			{status === 'success' && overlay && (
				<>
					{hidePeople ? (
						chat()
					) : (
						<div className={`grid ${getClass(overlay?.guests?.length || 0)}`}>
							{overlay?.guests?.map((g: { handle?: string; name?: string }, i: number) => (
								<div key={i} className="flex items-end">
									{g?.handle ? (
										<div className="p-1 m-1 text-sm break-all bg-purple-900 rounded text-purple-50">
											{g.handle}
										</div>
									) : (
										<div className="p-1 m-1 text-sm break-all bg-purple-900 rounded text-purple-50">
											{g?.name}
										</div>
									)}
								</div>
							))}
							chat()
						</div>
					)}
				</>
			)}
		</>
	);
}
