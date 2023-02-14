import { useState } from 'react';

import dynamic from 'next/dynamic';

import AJLogo from '@/components/global/icons/AJPrimary';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import { useUser } from 'reactfire';

const FirebaseAuth = dynamic(
  () =>
    import('@/components/FirebaseAuth').then((mod: any) => mod.FirebaseAuth),
  {
    ssr: false,
    loading: () => <p>Playing with yarn...</p>,
  }
);

export default function UserSignin(): JSX.Element {
  const [signin, setSignIn] = useState(false);
  const { data: user } = useUser();

  return (
    <>
      {user ? (
        <></>
      ) : (
        <section className="relative grid content-start pt-4 lg:pt-0">
          {/* Sign Up & Sign In Bar */}
          <div className="flex items-end justify-between">
            <div
              className={`flex justify-center rounded-t p-4 ${
                !signin ? 'bg-basics-50' : ''
              }`}
            >
              {' '}
              <h2
                className={`cursor-pointer text-2xl sm:text-3xl ${
                  !signin ? 'vertical-text-clip pb-1' : 'text-primary-900'
                }`}
                onClick={() => setSignIn(false)}
              >
                Sign Up
              </h2>
            </div>
            <div
              className="absolute top-0 left-1/2 lg:-top-4 xl:-top-6"
              style={{ transform: `translateX(-50%)` }}
            >
              {signin ? (
                <AJLogoLeft className="block w-24 sm:w-36 lg:w-24 xl:w-36 h-36" />
              ) : (
                <AJLogo className="block w-24 sm:w-36 lg:w-24 xl:w-36 h-36" />
              )}
            </div>
            <div
              className={`flex justify-center rounded-t  p-4 ${
                signin ? 'bg-basics-50' : ''
              }`}
            >
              <h2
                className={`cursor-pointer text-2xl sm:text-3xl ${
                  signin
                    ? 'vertical-text-clip pb-1 '
                    : 'text-primary-900 relative z-10'
                }`}
                onClick={() => setSignIn(true)}
              >
                Sign In
              </h2>
            </div>
          </div>
          {/* End Sign Up & Sign In Bar */}
          {/* Forms */}
          <div
            className={`p-10 bg-basics-50 rounded-b shadow-xl  ${
              signin ? 'rounded-tl' : 'rounded-tr'
            }`}
          >
            {/* SIGN UP */}
            <div className="grid justify-center">
              <FirebaseAuth />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
