import { useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { useUser } from '@/utils/auth/useUser';
import Drip from '@/components/global/icons/Drip';
import AJLogo from './global/icons/AJLogo';
import AJLogoLeft from './global/icons/AJLogoLeft';
import { sign } from 'crypto';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

export default function UserSignin() {
  const { user, logout }: { user: any; logout: any } = useUser();
  const [signin, setSignIn] = useState(false);

  return (
    <>
      <>
        <div className="relative flex justify-center mb-48 h-96">
          <div className="relative left-0 z-10 w-full pt-40 mx-2 sm:w-auto sm:absolute sm:pl-16 md:pl-20 lg:pl-48">
            <div className="flex justify-between w-full h-16">
              <div
                className={`flex justify-center h-full rounded-t p-2 ${
                  !signin ? 'bg-white' : ''
                }`}
              >
                {' '}
                <h5
                  className="cursor-pointer vertical-text-clip"
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
                className={`flex justify-center h-full rounded-t  p-2 ${
                  signin ? 'bg-white' : ''
                }`}
              >
                <h5
                  className="cursor-pointer vertical-text-clip"
                  onClick={() => setSignIn(true)}
                >
                  Sign In
                </h5>
              </div>
            </div>
            <div
              className={`px-4 py-8 bg-white rounded-b sm:px-10 ${
                signin ? 'rounded-tl' : 'rounded-tr'
              }`}
            >
              <div className={!signin ? 'hidden' : 'block'}>
                <FirebaseAuth full={false} />
                <Link href="/signin">
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
                  <div className="mb-4">
                    <label
                      className="block mb-2 text-sm font-bold text-grey-darker"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      className="w-full px-3 py-2 border rounded shadow appearance-none text-grey-darker"
                      id="username"
                      type="text"
                      placeholder="Username"
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
                    />
                    <p className="text-xs italic text-red">
                      Please choose a password.
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="px-4 py-2 font-bold text-white rounded bg-blue hover:bg-blue-dark"
                      type="button"
                    >
                      Sign In
                    </button>
                    <a
                      className="inline-block text-sm font-bold align-baseline text-blue hover:text-blue-darker"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute left-0 z-0 sm:pl-16 lg:pl-48">
            <Drip />
          </div>
        </div>
        <div className="relative flex justify-center h-96"></div>
      </>
    </>
  );
}
