import { StripeProduct } from '@/models/stripe.model';
import OutsideClick from '@/components/OutsideClick';
import { UserInfoExtended } from '@/models/user.model';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { config } from '@/config/cloudinary';
import { getApp } from '@firebase/app';
import {
  collection,
  doc,
  DocumentReference,
  getFirestore,
} from '@firebase/firestore';
import { useFirestoreDocData } from 'reactfire';

export default function StripeRedirect({
  checkoutSession,
  user,
}: {
  checkoutSession: string;
  user: UserInfoExtended;
}): JSX.Element {
  const app = getApp();
  const firestore = getFirestore(app);

  const sessionRef = doc(
    firestore,
    'customers',
    user.uid,
    'checkout_sessions',
    checkoutSession
  ) as unknown as DocumentReference<{ url: string | URL }>;
  const { status, data: session } = useFirestoreDocData(sessionRef);

  //We wait until the sessionId is added to the doc
  useEffect(() => {
    if (!session || !session.url) {
      return;
    }
    redirect(session);
  }, [session]);

  const redirect = async (session: { url: string | URL }) => {
    if (!config.apiKey) {
      alert('Missing Stripe API Key');
      return;
    }
    // We have a Stripe Checkout URL, let's redirect.
    window.location.assign(session.url);
  };

  if (checkoutSession) {
    return (
      <section className="flex items-center p-8 m-auto space-x-20 space-between bg-primary-900 dark:bg-primary-50 rounded-xl">
        <div className="grid gap-4 text-2xl text-primary-50 dark:text-primary-900">
          Redirecting to Stripe...
        </div>
      </section>
    );
  } else {
    return <></>;
  }
}
