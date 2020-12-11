import { useState } from 'react';
import Link from 'next/link';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import initFirebase from '@/utils/initFirebase';
import { setUserCookie } from '@/utils/auth/userCookies';
import { mapUserData } from '@/utils/auth/mapUserData';
import { UserInfo } from '@/models/userInfo.model';

// Init the Firebase app.
initFirebase();
// Auth providers

const FirebaseAuth = ({ full = true }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  let signInOptions = [];
  if (full) {
    signInOptions = [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      'apple.com',
      'microsoft.com',
      'yahoo.com',
    ];
  } else {
    signInOptions = [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
    ];
  }

  // https://github.com/firebase/firebaseui-web#configure-oauth-providers
  const firebaseAuthConfig = {
    signInFlow: 'popup',
    signInOptions,
    signInSuccessUrl: '/user/profile',
    credentialHelper: 'none',
    callbacks: {
      signInSuccessWithAuthResult: async (
        { user }: { user: firebase.User },
        redirectUrl: string
      ) => {
        const userData = await mapUserData(user);
        setUserCookie(userData);
      },
    },
  };

  function signin(email: string, password: string) {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log('Successfully SignedIn');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      {process.env.NEXT_PUBLIC_CCD_EMULATED ? (
        <div className="grid gap-4">
          <div className="">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@codingcat.dev"
              required
            />
          </div>
          <div className="">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              required
            />
          </div>
          <div>
            <button
              className="p-4 mb-16 text-white rounded bg-ccd-reds-500"
              onClick={() => signin(email, password)}
            >
              Sign In
            </button>
          </div>
        </div>
      ) : (
        <div>
          <StyledFirebaseAuth
            uiConfig={firebaseAuthConfig as any}
            firebaseAuth={firebase.auth()}
          />

          <Link href="/user/profile">
            <a>
              <button className="btn-primary rounded-none text-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M24 3.88235C24 1.73819 22.287 0 20.1739 0H10.087V2.11765H20.1739C21.1344 2.11765 21.913 2.90773 21.913 3.88235V20.1176C21.913 21.0923 21.1344 21.8824 20.1739 21.8824H10.087V24H20.1739C22.287 24 24 22.2618 24 20.1176V3.88235ZM10.087 18.1131L20.5217 12L10.087 5.88688V10.9412H-4.47035e-07V13.0588H10.087V18.1131Z"
                        fill="#FBFBFB"
                      />
                    </svg>

                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-6 h-6 text-ccd-basics-050"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg> */}
                  </div>
                  <p className="ml-4 text-ccd-basics-050">
                    Sign In with any provider
                  </p>
                </div>
              </button>
            </a>
          </Link>
        </div>
      )}
    </>
  );
};

export default FirebaseAuth;
