import SettingsLinks from '@/components/settings/SettingsLinks';
import { useFirestore, useSigninCheck } from 'reactfire';
import { StripePrice, StripeProduct } from '@/models/stripe.model';
import { AuthWrapper, FirebaseAuth } from '@/components/FirebaseAuth';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import ProfileProFeatures from '@/components/user/ProfileProFeatures';

const FirebaseFirestoreProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseFirestoreProvider
    ),
  {
    ssr: false,
  }
);

const MembershipCards = dynamic<any>(
  () => import('@/components/user/MembershipCards'),
  {
    ssr: false,
  }
);

const UserMembership = dynamic<any>(
  () => import('@/components/user/UserMembership'),
  {
    ssr: false,
  }
);

export default function Profile({ main = false }): JSX.Element {
  const { data: signInCheckResult } = useSigninCheck();
  const firestore = useFirestore();

  const [products, setProducts] = useState<StripeProduct[]>([]);
  useEffect(() => {
    setProducts([]);
    const ref = collection(firestore, 'products');
    const q = query(
      ref,
      where('active', '==', true),
      where('role', 'in', ['monthly', 'yearly', 'supporter'])
    );
    getDocs(q).then((querySnapshot) => {
      for (const productDoc of querySnapshot.docs) {
        const refPrices = collection(
          firestore,
          `products/${productDoc.id}/prices`
        );
        const qPrices = query(refPrices, where('active', '==', true));
        getDocs(qPrices).then((pricesSnapshot) => {
          const prices: StripePrice[] = [];
          for (const priceDoc of pricesSnapshot.docs) {
            const price = priceDoc.data() as StripePrice;
            price.id = priceDoc.id;
            prices.push(price);
          }
          const product = productDoc.data() as StripeProduct;
          product.id = productDoc.id;
          product.prices = prices;
          setProducts((p) => [...p, product]);
        });
      }
    });
  }, [firestore]);

  const notSignedIn = () => {
    return (
      <>
        <ProfileProFeatures />
        <FirebaseAuth />
        <section className="grid grid-cols-1 gap-10 text-center">
          <div className="max-w-xl mx-auto">
            <h1 className="font-sans text-4xl font-semibold lg:text-5xl ">
              Become a{' '}
              <span className="text-secondary-600 dark:text-secondary-600">
                Purrfect Peep
              </span>{' '}
              and join CodingCat.dev
            </h1>
            <h2 className="mt-4 font-sans text-lg lg:text-lg text-basics-600">
              Get access to all of the exclusive content and up your coding
              skills.
            </h2>
          </div>
          {products && <MembershipCards products={products} />}
        </section>
      </>
    );
  };

  return (
    <FirebaseFirestoreProvider>
      <AuthWrapper fallback={notSignedIn()}>
        {main ? (
          <>
            <UserMembership
              user={signInCheckResult?.user}
              products={products}
            />
          </>
        ) : (
          <section className="grid self-start w-full gap-10 p-10 lg:grid-cols-settings">
            <section>
              <h2 className="mb-4 font-sans text-4xl vertical-text-clip">
                Settings
              </h2>
              <SettingsLinks />
            </section>
            {signInCheckResult?.user && (
              <div className="flex flex-col">
                <UserMembership
                  user={signInCheckResult.user}
                  products={products}
                />
              </div>
            )}
          </section>
        )}
      </AuthWrapper>
    </FirebaseFirestoreProvider>
  );
}
