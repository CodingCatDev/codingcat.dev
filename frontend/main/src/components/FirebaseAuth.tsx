import { useState } from 'react';
//  import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  TwitterAuthProvider,
} from '@firebase/auth';
import { useAuth } from 'reactfire';
import dynamic from 'next/dynamic';

const StyledFirebaseAuth = dynamic(
  () => import('react-firebaseui/StyledFirebaseAuth').then((res) => res as any),
  { ssr: false }
) as any;

const FirebaseAuth = ({ full = true }: { full?: boolean }): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  let signInOptions = [];
  if (full) {
    signInOptions = [
      EmailAuthProvider.PROVIDER_ID,
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
      EmailAuthProvider.PROVIDER_ID,
      GoogleAuthProvider.PROVIDER_ID,
      TwitterAuthProvider.PROVIDER_ID,
      GithubAuthProvider.PROVIDER_ID,
    ];
  }
  const uiConfig = {
    signInFlow: 'popup',
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

export default FirebaseAuth;
