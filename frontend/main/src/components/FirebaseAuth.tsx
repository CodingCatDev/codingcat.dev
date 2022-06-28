import { useState } from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  TwitterAuthProvider,
} from '@firebase/auth';
import { useAuth, useSigninCheck } from 'reactfire';
import { Auth, User } from 'firebase/auth';

export const FirebaseAuth = ({
  full = true,
}: {
  full?: boolean;
}): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  let signInOptions = [];
  if (full) {
    signInOptions = [
      GoogleAuthProvider.PROVIDER_ID,
      FacebookAuthProvider.PROVIDER_ID,
      TwitterAuthProvider.PROVIDER_ID,
      GithubAuthProvider.PROVIDER_ID,
      'apple.com',
      'microsoft.com',
      'yahoo.com',
    ];
  } else {
    signInOptions = [
      GoogleAuthProvider.PROVIDER_ID,
      TwitterAuthProvider.PROVIDER_ID,
      GithubAuthProvider.PROVIDER_ID,
    ];
  }
  const uiConfig = {
    signInOptions,
    signInSuccessUrl: window.location.href,
    credentialHelper: 'none',
    tosUrl: `${window.location.origin}/terms-of-use`,
    // Privacy policy url/callback.
    privacyPolicyUrl() {
      window.open(`${window.location.origin}/privacy-policy`);
    },
  };

  function signin(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
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
              className="block mb-2 text-sm font-bold text-basics-800"
              htmlFor="username"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 border rounded shadow appearance-none text-basics-800"
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
              className="block mb-2 text-sm font-bold text-basics-800"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 mb-3 border rounded shadow appearance-none border-red text-basics-800"
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
              className="p-4 mb-16 rounded bg-error-500 text-basics-50"
              onClick={() => signin(email, password)}
            >
              Sign In
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid justify-center">
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
          </div>
        </>
      )}
    </>
  );
};

export const AuthWrapper = ({
  children,
  fallback,
}: React.PropsWithChildren<{ fallback: JSX.Element }>): JSX.Element => {
  const { status, data: signInCheckResult } = useSigninCheck();

  if (!children) {
    throw new Error('Children must be provided');
  }
  if (status === 'loading') {
    return <LoadingSpinner />;
  } else if (signInCheckResult.signedIn === true) {
    return children as JSX.Element;
  }

  return fallback;
};

export const LoadingSpinner = () => {
  return (
    <svg
      role="status"
      className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
  );
};
export const signOut = (auth: Auth) =>
  auth.signOut().then(() => {
    console.log('signed out');
    window.location.href = '/';
  });
