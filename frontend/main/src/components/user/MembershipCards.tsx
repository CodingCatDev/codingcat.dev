import Image from 'next/image';
import {
  StripeLineItem,
  StripePrice,
  StripeProduct,
} from '@/models/stripe.model';
import AJPrimary from '@/components/global/icons/AJPrimary';
import { useState } from 'react';
import OutsideClick from '@/components/OutsideClick';
import { getApp } from '@firebase/app';
import { collection, addDoc } from 'firebase/firestore';
import { UserInfoExtended } from '@/models/user.model';
import StripeRedirect from '@/components/user/StripeRedirect';
import { useFirestore } from 'reactfire';

export default function MembershipCards({
  products,
  user,
}: {
  user?: UserInfoExtended;
  products: StripeProduct[];
}): JSX.Element {
  const [stripe, setStripe] = useState(false);
  const firestore = useFirestore();
  const [showMustSignin, setShowMustSignin] = useState(false);
  const [checkoutSession, setCheckoutSession] = useState<string | null>(null);

  const stripeCheckout = async (product: StripeProduct, uid: string) => {
    const line_items: StripeLineItem[] = [];

    product.prices.forEach((price: StripePrice) =>
      line_items.push({
        price: price.id,
        quantity: 1,
      })
    );

    const customerRef = collection(
      firestore,
      'customers',
      uid,
      'checkout_sessions'
    );
    const docRef = await addDoc(customerRef, {
      line_items,
      allow_promotion_codes: true,
      success_url: window.location.href,
      cancel_url: window.location.href,
    });
    setCheckoutSession(docRef.id);
  };

  function onSelectPlan(product: StripeProduct) {
    if (product.prices && user?.uid) {
      setStripe(true);
      stripeCheckout(product, user?.uid);
    } else {
      setShowMustSignin(true);
    }
  }

  const getProductImage = (product: StripeProduct) => {
    if (!product || !product.images) {
      return <AJPrimary className="w-full h-full" />;
    }

    const img = product.images[0];

    if (!img) {
      return <AJPrimary className="w-full h-full" />;
    }

    return (
      <Image
        src={img}
        loader={() => img}
        unoptimized={true}
        layout="fill"
        className="z-10"
        alt={`Product Photo for ${product.description}`}
      />
    );
  };

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
      <section className="flex flex-wrap justify-center gap-10 text-center">
        {/* <div className="grid items-stretch justify-center gap-1 lg:grid-flow-col justify-items-stretch"> */}
        {products?.map((product) => (
          <div
            className="relative flex flex-col justify-between max-w-sm px-4 pt-10 pb-4 space-y-4 overflow-hidden rounded-lg shadow-lg cursor-pointer bg-primary-800 dark:bg-primary-800 text-basics-50 dark:text-basics-50"
            key={product.role}
            onClick={() => onSelectPlan(product)}
          >
            <div className="relative">
              <svg
                className={'svgTransform absolute top-0 left-0 mb-8'}
                viewBox="0 0 375 283"
                fill="none"
              >
                <rect
                  x="159.52"
                  y="175"
                  width="152"
                  height="152"
                  rx="8"
                  transform="rotate(-45 159.52 175)"
                  fill="white"
                />
                <rect
                  y="107.48"
                  width="152"
                  height="152"
                  rx="8"
                  transform="rotate(-45 0 107.48)"
                  fill="white"
                />
              </svg>
              <div className="w-48 h-48">
                {product.images ? (
                  getProductImage(product)
                ) : (
                  <AJPrimary className="w-full h-full" />
                )}
              </div>
            </div>
            <div className="block w-48 text-basics-200 dark:text-basics-200">
              {product?.description}
            </div>
            <div className="flex justify-between">
              <span className="block text-xl font-semibold">
                {product.name}
              </span>
              <span className="flex items-center px-3 py-2 font-bold leading-none bg-white rounded-full bg-secondary-400 text-md">
                {product.prices ? (
                  <div>
                    <span>
                      {product.prices[0].currency === 'usd' ? '$' : ''}
                    </span>
                    {product.prices[0].unit_amount
                      ? product.prices[0].unit_amount / 100
                      : 0}
                  </div>
                ) : (
                  <></>
                )}
              </span>
            </div>
          </div>
        ))}
        {/* </div> */}
      </section>
      <style jsx>{`
        .svgTransform {
          transform: scale(1.5);
          opacity: 0.1;
        }
      `}</style>
    </>
  );
}
