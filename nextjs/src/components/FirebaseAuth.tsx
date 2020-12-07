import { useState } from 'react';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import initFirebase from '@/utils/initFirebase';
import { setUserCookie } from '@/utils/auth/userCookies';
import { mapUserData } from '@/utils/auth/mapUserData';

// Init the Firebase app.
initFirebase();
// Auth providers

const FirebaseAuth = ({ full = true }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  let signInOptions = [];
  if (full) {
    signInOptions = [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        requireDisplayName: false,
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      'apple.com',
      'microsoft.com',
      'yahoo.com',
    ];
  } else {
    signInOptions = [
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
      signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
        const userData = await mapUserData(user);
        setUserCookie(userData);
      },
    },
  };

  function signin() {
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              required
            />
          </div>
          <div>
            <button
              className="p-4 mb-16 text-white rounded bg-ccd-reds-500"
              onClick={() => signin()}
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
        </div>
      )}
    </>
  );
};

export default FirebaseAuth;
