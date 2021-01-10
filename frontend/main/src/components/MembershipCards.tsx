import { StripeProduct } from '@/models/stripe.model';
import { stripeCheckout } from '@/services/api';
import { useUser } from '@/utils/auth/useUser';
import { take } from 'rxjs/operators';
import AJPrimary from './global/icons/AJPrimary';
import { useState } from 'react';
import OutsideClick from '@/components/OutsideClick';
import { Transition } from '@headlessui/react';

export default function MembershipCards({
  products,
}: {
  products: StripeProduct[];
}): JSX.Element {
  const [stripe, setStripe] = useState(false);
  const [showMustSignin, setShowMustSignin] = useState(false);
  const { user } = useUser();

  function onSelectPlan(product: StripeProduct) {
    if (product.prices && user?.uid) {
      stripeCheckout(product.prices[0], user?.uid)
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
      <Transition
        show={showMustSignin}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-50 overflow-hidden bg-primary-100 bg-opacity-80">
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
      </Transition>
      <Transition
        show={stripe}
        enter="transition-opacity duration-75"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 z-50 overflow-hidden bg-primary-100 bg-opacity-80">
          <section
            className="absolute inset-y-0 left-0 grid w-full h-full place-items-center justify-items-center"
            aria-labelledby="slide-over-heading"
          >
            <OutsideClick toggle={setStripe} value={false}>
              <section className="flex items-center p-8 m-auto space-x-20 space-between bg-primary-900 dark:bg-primary-50 rounded-xl">
                <div className="grid gap-4 text-2xl text-primary-50 dark:text-primary-900">
                  <div>Please Sign in First.</div>
                  <div>Then make your Membership selection.</div>
                </div>
              </section>
            </OutsideClick>
          </section>
        </div>
      </Transition>
      <section className="mx-auto text-center">
        <div className="grid items-stretch justify-center gap-1 lg:grid-flow-col justify-items-stretch">
          {products.map((product) => (
            <div
              className="relative w-full h-full max-w-sm m-6 overflow-hidden rounded-lg shadow-lg cursor-pointer bg-primary- bg-primary-800"
              key={product.role}
              onClick={() => onSelectPlan(product)}
            >
              <svg
                className={'svgTransform absolute bottom-0 left-0 mb-8'}
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
              <div className="grid w-full h-full grid-flow-row ">
                <div className="relative flex flex-col items-center justify-center px-10 pt-10">
                  <div
                    className={
                      'radialGradiant block absolute w-48 h-48 bottom-0 left-0 mb-24 ml-3'
                    }
                  ></div>
                  <div className="w-full h-full">
                    {product.images ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        width="480"
                        height="270"
                      />
                    ) : (
                      <AJPrimary className="w-64 h-64" />
                    )}
                  </div>
                </div>
                <div className="relative self-end px-6 pb-2 mt-6 text-white">
                  <span className="block pb-4 mb-1 opacity-75">
                    {product?.description}
                  </span>
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
              </div>
            </div>
          ))}
        </div>
      </section>
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
