import { UserInfoExtended } from '@/models/user.model';
import { StripePrice } from './../models/stripe.model';
import { httpsCallable } from 'rxfire/functions';
import firebase from 'firebase/app';
import initFirebase from '@/utils/initFirebase';
import { docData } from 'rxfire/firestore';
import { filter, map, switchMap } from 'rxjs/operators';
import { from } from 'rxjs';

import { loadStripe } from '@stripe/stripe-js';
import { config } from '@/config/stripe';

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

export const userDataObservable = (uid: string) => {
  return firestore$.pipe(
    switchMap((firestore) =>
      docData<UserInfoExtended>(firestore.doc(`/users/${uid}`), uid)
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

/* Cloudinary */
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

/* Stripe */
export const stripeCheckout = (price: StripePrice, uid: string) => {
  return firestore$.pipe(
    switchMap(async (firestore) => {
      const docRef = await firestore
        .collection('customers')
        .doc(uid)
        .collection('checkout_sessions')
        .add({
          price: price.id,
          success_url: window.location.origin,
          cancel_url: window.location.href,
        });
      docRef.onSnapshot(async (snap) => {
        const { error, sessionId } = snap.data() as string | any;
        if (error) {
          // Show an error to your customer and
          // inspect your Cloud Function logs in the Firebase console.
          alert(`An error occured: ${error.message}`);
        }
        if (sessionId) {
          // We have a session, let's redirect to Checkout
          // Init Stripe
          if (config.apiKey) {
            const stripe = await loadStripe(config.apiKey);
            if (stripe) stripe.redirectToCheckout({ sessionId });
          } else {
            console.error('Missing Stripe API Key');
          }
        }
      });
    })
  );
};

export const getStripePortal = () => {
  return functions$.pipe(
    switchMap((functions) =>
      httpsCallable<
        unknown,
        {
          id: string;
          object: string;
          created: number;
          customer: string;
          livemode: boolean;
          return_url: string;
          url: string;
        }
      >(
        functions,
        'ext-firestore-stripe-subscriptions-createPortalLink'
      ).call('params', { returnUrl: window.location.href })
    )
  );
};
