import { useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useUser } from '@/utils/auth/useUser';
import AJLogo from './global/icons/AJPrimary';
import AJLogoLeft from './global/icons/AJAlt';
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
        <>
          <div className="flex flex-col justify-start mb-48 h-96">
            <div className="flex justify-between w-full">
              <div
                className={`flex justify-center h-full w-1/3 rounded-t p-2 ${
                  !signin ? 'bg-ccd-basics-050' : ''
                }`}
              >
                {' '}
                <h5
                  className={`cursor-pointer ${
                    !signin ? 'vertical-text-clip' : 'text-white'
                  }`}
                  onClick={() => setSignIn(false)}
                >
                  Sign Up
                </h5>
              </div>
              <div className="relative">
                {signin ? (
                  <AJLogoLeft className="block w-20 h-20" />
                ) : (
                  <AJLogo className="block w-20 h-20" />
                )}
              </div>
              <div
                className={`flex justify-center h-full w-1/3 rounded-t  p-2 ${
                  signin ? 'bg-ccd-basics-050' : ''
                }`}
              >
                <h5
                  className={`cursor-pointer ${
                    signin ? 'vertical-text-clip' : 'text-white'
                  }`}
                  onClick={() => setSignIn(true)}
                >
                  Sign In
                </h5>
              </div>
            </div>
            <div
              className={`px-4 py-8 bg-ccd-basics-050 rounded-b sm:px-10 shadow-xl  ${
                signin ? 'rounded-tl' : 'rounded-tr'
              }`}
            >
              <div className={!signin ? 'hidden' : 'block'}>
                <FirebaseAuth full={false} />
                <Link href="/user/profile">
                  <a>
                    <button className="flex items-center justify-between w-full h-10 px-2 rounded shadow-lg bg-ccd-purples-800">
                      <span className="">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-6 h-6 text-white"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-white">
                        Sign In with any provider
                      </span>
                    </button>
                  </a>
                </Link>
              </div>
              <div className={signin ? 'hidden' : 'block'}>
                <div className="flex flex-col">
                  <div className="mb-6">
                    <label
                      className="block mb-2 text-sm font-bold text-grey-darker"
                      htmlFor="username"
                    >
                      Email
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded shadow appearance-none text-grey-darker"
                      id="email"
                      type="email"
                      placeholder="alex@codingcat.dev"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block mb-2 text-sm font-bold text-grey-darker"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 border rounded shadow appearance-none border-red text-grey-darker"
                      id="password"
                      type="password"
                      placeholder="******************"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block mb-2 text-sm font-bold text-grey-darker"
                      htmlFor="passwordConfirm"
                    >
                      Confirm Password
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 border rounded shadow appearance-none border-red text-grey-darker"
                      id="passwordConfirm"
                      type="password"
                      placeholder="******************"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="block mb-2 text-sm font-bold text-grey-darker"
                      htmlFor="name"
                    >
                      Name
                    </label>
                    <input
                      className="w-full px-3 py-2 mb-3 border rounded shadow appearance-none border-red text-grey-darker"
                      id="name"
                      type="text"
                      placeholder="Alex"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="px-4 py-2 font-bold text-white rounded bg-ccd-purples-900 hover:bg-blue-dark"
                      type="button"
                    >
                      Create Account
                    </button>
                  </div>
                  <div className="mt-6 mb-6">
                    <label
                      className="block mb-2 text-sm font-bold text-grey-darker"
                      htmlFor="name"
                    >
                      Name
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="w-full px-4 py-2 font-bold text-white rounded bg-ccd-purples-900 hover:bg-blue-dark"
                      type="button"
                    >
                      Go Pro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center hidden h-48 lg:block"></div>
        </>
      )}
    </>
  );
}
