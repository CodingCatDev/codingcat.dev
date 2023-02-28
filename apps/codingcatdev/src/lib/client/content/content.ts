import { initializeApp, getApps } from 'firebase/app';
import {
	getFirestore,
	query,
	collection,
	where,
	orderBy,
	limit,
	startAfter,
	getDocs,
	Timestamp
} from 'firebase/firestore';
import {
	PUBLIC_FB_API_KEY,
	PUBLIC_FB_AUTH_DOMAIN,
	PUBLIC_FB_PROJECT_ID,
	PUBLIC_FB_STORAGE_BUCKET,
	PUBLIC_FB_MESSAGE_SENDER_ID,
	PUBLIC_FB_APP_ID,
	PUBLIC_FB_MEASUREMENT_ID
} from '$env/static/public';
import { ContentType } from '$lib/types';

export const LIMIT = 20;

const firebaseConfig = {
	apiKey: PUBLIC_FB_API_KEY,
	authDomain: PUBLIC_FB_AUTH_DOMAIN,
	projectId: PUBLIC_FB_PROJECT_ID,
	storageBucket: PUBLIC_FB_STORAGE_BUCKET,
	messagingSenderId: PUBLIC_FB_MESSAGE_SENDER_ID,
	appId: PUBLIC_FB_APP_ID,
	measurementId: PUBLIC_FB_MEASUREMENT_ID
};

let app = getApps().at(0);
if (!app) {
	app = initializeApp(firebaseConfig);
}
export const firestore = getFirestore(app);

// /**
//  * List all content from specified content type.
//  * @param {import('$lib/types').ContentType} contentType
//  * @param {import("firebase/firestore").QueryDocumentSnapshot<import("firebase/firestore").DocumentData>} after
//  * @param {number=} queryLimit
//  * @returns {Promise<import('$lib/types').Content[]>}
//  * */
// export const moreContent = async (contentType, after, queryLimit) => {
// 	// console.log(after.data());
// 	let q = query(
// 		collection(firestore, contentType),
// 		where('start', '<=', Timestamp.fromDate(new Date())),
// 		orderBy('start', 'desc'),
// 		orderBy('title', 'asc'),
// 		where('published', '==', 'published'),
// 		startAfter(after),
// 		limit(queryLimit || LIMIT)
// 	);

// 	if (contentType === ContentType.podcast) {
// 		console.log(`List for type: ${contentType} after ${after}`);

// 		q = query(
// 			collection(firestore, contentType),
// 			where('status', '==', 'released'),
// 			where('start', '<=', Timestamp.fromDate(new Date())),
// 			orderBy('start', 'desc'),
// 			orderBy('season', 'desc'),
// 			orderBy('episode', 'desc'),
// 			startAfter(after),
// 			limit(queryLimit || LIMIT)
// 		);
// 	}
// 	const querySnapshot = await getDocs(q);
// 	console.log(after);
// 	console.log(querySnapshot.docs[querySnapshot.docs.length - 1]);
// 	return querySnapshot.docs.map((doc) => {
// 		return {
// 			id: doc.id,
// 			...doc.data(),
// 			start: doc.data().start ? doc.data().start.toDate() : doc.data().start
// 		};
// 	});
// };
