import { httpsCallable } from 'rxfire/functions';
import firebase from 'firebase/app';
import initFirebase from '@/utils/initFirebase';
import { docData } from 'rxfire/firestore';
import { filter, map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

const firestore$ = from(initFirebase()).pipe(
  filter((app) => app !== undefined),
  map((app) => app as firebase.app.App),
  map((app) => app.firestore() as firebase.firestore.Firestore)
);

const functions$ = from(initFirebase()).pipe(
  filter((app) => app !== undefined),
  map((app) => app as firebase.app.App),
  map((app) => app.functions() as firebase.functions.Functions)
);

// User
export const userProfileDataObservable = (uid: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      docData<firebase.UserInfo>(firestore.doc(`/profiles/${uid}`), uid)
    )
  );
};

/* Utilities may be used on front end */
export function cleanTimestamp(data: FirebaseFirestore.DocumentData) {
  const docData = { ...data };
  Object.keys(docData).map((key) => {
    if (
      typeof docData[key] === 'object' &&
      Object.keys(docData[key]).includes('nanoseconds')
    ) {
      const timestamp: firebase.firestore.Timestamp = docData[key];
      docData[key] = timestamp.toDate().toString();
    } else {
      docData[key] = docData[key];
    }
  });
  return docData;
}

//Cloudinary
export const getCloudinaryCookieToken = () => {
  return functions$.pipe(
    switchMap((functions) =>
      httpsCallable<unknown, string>(functions, 'cloudinaryCookieToken').call(
        'params',
        {}
      )
    )
  );
};
