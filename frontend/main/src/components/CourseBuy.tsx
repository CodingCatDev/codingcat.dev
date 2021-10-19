import {
  StripeLineItem,
  StripePrice,
  StripeProduct,
} from '@/models/stripe.model';
import { useState } from 'react';
import OutsideClick from '@/components/OutsideClick';
import { UserInfoExtended } from '@/models/user.model';
import { collection, addDoc } from 'firebase/firestore';
import StripeRedirect from '@/components/user/StripeRedirect';
import { useFirestore } from 'reactfire';

export default function CourseBuy({
  user,
  product,
}: {
  user: UserInfoExtended;
  product: StripeProduct;
}): JSX.Element {
  const firestore = useFirestore();

  const [stripe, setStripe] = useState(false);
  const [showMustSignin, setShowMustSignin] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<string | null>(null);

  const stripeCheckout = async (product: StripeProduct, uid: string) => {
    const customerRef = collection(
      firestore,
      'customers',
      uid,
      'checkout_sessions'
    );
    if (product && product.prices && product.prices.length > 0) {
      const price = product.prices[0];
      if (product) {
        const docRef = await addDoc(customerRef, {
          mode: 'payment',
          price: price.id,
          success_url: window.location.href,
          cancel_url: window.location.href,
        });
        setCheckoutSession(docRef.id);
      } else {
        console.error('Missing Stripe Pricing');
      }
    }
  };

  function onSelectPlan() {
    if (product.prices && user?.uid) {
      setStripe(true);
      stripeCheckout(product, user?.uid);
    } else {
      setShowMustSignin(true);
    }
  }

  return (
    <>
      <div
        className={`${
          showMustSignin ? 'block' : 'hidden'
        } fixed inset-0 z-50 overflow-hidden bg-primary-100 bg-opacity-80`}
      >
        <section
          className="absolute inset-y-0 left-0 grid w-full h-full place-items-center justify-items-center"
          aria-labelledby="slide-over-heading"
        >
          <OutsideClick toggle={setShowMustSignin} value={false}>
            <section className="flex items-center p-8 m-auto space-x-20 space-between bg-primary-900 dark:bg-primary-50 rounded-xl">
              <div className="grid gap-4 text-2xl text-primary-50 dark:text-primary-900">
                <div>Please Sign in First.</div>
                <div>Then make your Membership selection.</div>
              </div>
            </section>
          </OutsideClick>
        </section>
      </div>
      <button className="btn-secondary" onClick={(e) => onSelectPlan()}>
        Buy Now
      </button>
      <div
        className={`${
          stripe ? 'block' : 'hidden'
        } fixed inset-0 z-50 overflow-hidden bg-primary-100 bg-opacity-80`}
      >
        <section
          className="absolute inset-y-0 left-0 grid w-full h-full place-items-center justify-items-center"
          aria-labelledby="slide-over-heading"
        >
          {user && stripe && checkoutSession && (
            <StripeRedirect checkoutSession={checkoutSession} user={user} />
          )}
        </section>
      </div>
      <style jsx>{`
        .svgTransform {
          transform: scale(1.5);
          opacity: 0.1;
        }

        .radialGradiant {
          background: radial-gradient(black, transparent 60%);
          transform: rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1);
          opacity: 0.2;
        }
      `}</style>
    </>
  );
}
