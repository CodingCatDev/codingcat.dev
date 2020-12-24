import { useState } from 'react';

import dynamic from 'next/dynamic';

import { useUser } from '@/utils/auth/useUser';
import AJLogo from '../global/icons/AJPrimary';
import AJLogoLeft from '../global/icons/AJAlt';
import { sign } from 'crypto';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

export default function UserSignin() {
  const { user, signout }: { user: any; signout: any } = useUser();
  const [signin, setSignIn] = useState(false);

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
                !signin ? 'bg-gray-050' : ''
              }`}
            >
              {' '}
              <h2
                className={`cursor-pointer text-2xl sm:text-3xl ${
                  !signin ? 'vertical-text-clip pb-1' : 'text-purple-900'
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
                signin ? 'bg-gray-050' : ''
              }`}
            >
              <h2
                className={`cursor-pointer text-2xl sm:text-3xl ${
                  signin
                    ? 'vertical-text-clip pb-1 '
                    : 'text-purple-900 relative z-10'
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
            className={`p-10 bg-gray-050 rounded-b shadow-xl  ${
              signin ? 'rounded-tl' : 'rounded-tr'
            }`}
          >
            {/* SIGN UP */}
            <div className="grid justify-center">
              <FirebaseAuth full={false} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
