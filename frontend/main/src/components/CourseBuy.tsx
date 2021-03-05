import Link from 'next/link';
import { StripeProduct } from '@/models/stripe.model';
import { stripeCheckout } from '@/services/api';
import { useUser } from '@/utils/auth/useUser';
import { take } from 'rxjs/operators';
import AJPrimary from './global/icons/AJPrimary';
import { Dispatch, SetStateAction, useState } from 'react';
import OutsideClick from '@/components/OutsideClick';

export default function CourseBuy({
  product,
  setShowMustSignin,
}: {
  product: StripeProduct;
  setShowMustSignin: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const [stripe, setStripe] = useState(false);
  const { user } = useUser();

  function onSelectPlan(e: any) {
    e.preventDefault();
    if (product && user?.uid) {
      setStripe(true);
      stripeCheckout(product, user?.uid)
        .pipe(take(1))
        .subscribe((sessionId) => {
          console.log(sessionId);
        });
    } else {
      setShowMustSignin(true);
    }
  }

  return (
    <>
      <button className="btn-secondary" onClick={(e) => onSelectPlan(e)}>
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
          <OutsideClick toggle={setStripe} value={false}>
            <section className="flex items-center p-8 m-auto space-x-20 space-between bg-primary-900 dark:bg-primary-50 rounded-xl">
              <div className="grid gap-4 text-2xl text-primary-50 dark:text-primary-900">
                Redirecting to Stripe...
              </div>
            </section>
          </OutsideClick>
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
