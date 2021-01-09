import { StripeProduct } from '@/models/stripe.model';
import { stripeCheckout } from '@/services/api';
import { useUser } from '@/utils/auth/useUser';
import { take } from 'rxjs/operators';
import AJPrimary from './global/icons/AJPrimary';

export default function MembershipCards({
  products,
}: {
  products: StripeProduct[];
}): JSX.Element {
  const { user } = useUser();

  function onSelectPlan(product: StripeProduct) {
    if (product.prices && user?.uid) {
      stripeCheckout(product.prices[0], user?.uid)
        .pipe(take(1))
        .subscribe((sessionId) => {
          console.log(sessionId);
        });
    } else {
      //TODO: Modal for making user signin first.
      console.log('signin');
    }
  }

  return (
    <>
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
