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
        <section className="pt-4 lg:pt-0 grid content-start relative">
          {/* Sign Up & Sign In Bar */}
          <div className="flex items-end justify-between">
            <div
              className={`flex justify-center rounded-t p-4 ${
                !signin ? 'bg-ccd-basics-050' : ''
              }`}
            >
              {' '}
              <h2
                className={`cursor-pointer text-2xl sm:text-3xl ${
                  !signin ? 'vertical-text-clip pb-1' : 'text-ccd-purples-900'
                }`}
                onClick={() => setSignIn(false)}
              >
                Sign Up
              </h2>
            </div>
            <div
              className="absolute left-1/2 top-0 lg:-top-4 xl:-top-6"
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
                signin ? 'bg-ccd-basics-050' : ''
              }`}
            >
              <h2
                className={`cursor-pointer text-2xl sm:text-3xl ${
                  signin
                    ? 'vertical-text-clip pb-1 '
                    : 'text-ccd-purples-900 relative z-10'
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
            className={`p-10 bg-ccd-basics-050 rounded-b shadow-xl  ${
              signin ? 'rounded-tl' : 'rounded-tr'
            }`}
          >
            <div className={!signin ? 'hidden' : 'grid justify-center'}>
              <FirebaseAuth full={false} />
            </div>
            {/* SIGN UP */}
            <form className={signin ? 'hidden' : 'grid gap-4'}>
              <div className="flex justify-between w-full">
                <p>Create an account:</p>
                <p>
                  or{' '}
                  <span
                    role="link"
                    className="cursor-pointer hover:underline"
                    onClick={() => setSignIn(true)}
                  >
                    Sign In
                  </span>
                </p>
              </div>
              <label
                className="block mb-2 text-sm font-bold text-grey-darker"
                htmlFor="username"
              >
                Email
                <input
                  className="w-full px-3 py-2 border rounded shadow appearance-none text-grey-darker"
                  id="email"
                  type="email"
                  placeholder="alex@codingcat.dev"
                  required
                />
              </label>
              <label
                className="block mb-2 text-sm font-bold text-grey-darker"
                htmlFor="password"
              >
                Password
                <input
                  className="w-full px-3 py-2 mb-3 border rounded shadow appearance-none border-red text-grey-darker"
                  id="password"
                  type="password"
                  placeholder="******************"
                  required
                />{' '}
              </label>
              <label
                className="block mb-2 text-sm font-bold text-grey-darker"
                htmlFor="passwordConfirm"
              >
                Confirm Password
                <input
                  className="w-full px-3 py-2 mb-3 border rounded shadow appearance-none border-red text-grey-darker"
                  id="passwordConfirm"
                  type="password"
                  placeholder="******************"
                  required
                />{' '}
              </label>
              <label
                className="block mb-2 text-sm font-bold text-grey-darker"
                htmlFor="name"
              >
                Name
                <input
                  className="w-full px-3 py-2 mb-3 border rounded shadow appearance-none border-red text-grey-darker"
                  id="name"
                  type="text"
                  placeholder="Alex"
                  required
                />{' '}
              </label>
              <button className="justify-self-start btn-primary" type="button">
                Create Account
              </button>

              <button className="btn-primary w-full" type="button">
                Go Pro
              </button>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
