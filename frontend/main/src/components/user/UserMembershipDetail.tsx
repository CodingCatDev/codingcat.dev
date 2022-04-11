import SettingsLinks from '@/components/settings/SettingsLinks';

import { useFunctions, useSigninCheck } from 'reactfire';
import { useState } from 'react';
import { httpsCallable } from '@firebase/functions';

export default function UserMembershipDetail(): JSX.Element {
  const { data: signInCheckResult } = useSigninCheck();
  const functions = useFunctions();

  const [loading, setLoading] = useState(false);
  async function onStripePortal() {
    setLoading(true);
    const { url } = await (
      await httpsCallable<unknown, { url: string }>(
        functions,
        'ext-firestore-stripe-subscriptions-createPortalLink'
      ).call('params', { returnUrl: window.location.href })
    )?.data;
    window.location.assign(url);
  }

  return (
    <>
      {signInCheckResult?.signedIn === true && signInCheckResult.user && (
        <section className="">
          <div className="grid">
            <div>
              <p className="text-4xl">CodingCat.dev uses the Stripe Portal.</p>
              <p className="text-2xl">
                You will find all payment and subscription statuses by clicking
                the below button.
              </p>
              <button
                className="mt-4 btn-primary"
                onClick={() => onStripePortal()}
              >
                {loading ? 'Redirecting...' : 'Access Stripe Portal'}
              </button>
              <p className="mt-1">
                *Please note this will redirect you away from CodingCat.dev
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
