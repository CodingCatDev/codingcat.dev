import { useState } from 'react';
import Link from 'next/link';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebaseApp from 'firebase/app';
import initFirebase from '@/utils/initFirebase';
import { useEffect } from 'react';

const FirebaseAuth = ({ full = true }: { full?: boolean }) => {
  const [app, setApp] = useState<firebaseApp.app.App>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    firebaseAuthConfig,
    setFirebaseAuthConfig,
  ] = useState<firebaseui.auth.Config>();

  const setDynamicFirebase = async () => {
    const app = await initFirebase();
    if (app) {
      setApp(app);
    }
  };

  useEffect(() => {
    setDynamicFirebase();
  }, []);

  useEffect(() => {
    if (!app) {
      return;
    }
    let signInOptions = [];
    if (full) {
      signInOptions = [
        firebaseApp.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID,
        firebaseApp.auth.FacebookAuthProvider.PROVIDER_ID,
        firebaseApp.auth.TwitterAuthProvider.PROVIDER_ID,
        firebaseApp.auth.GithubAuthProvider.PROVIDER_ID,
        'apple.com',
        'microsoft.com',
        'yahoo.com',
      ];
    } else {
      signInOptions = [
        firebaseApp.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseApp.auth.GoogleAuthProvider.PROVIDER_ID,
        firebaseApp.auth.TwitterAuthProvider.PROVIDER_ID,
        firebaseApp.auth.GithubAuthProvider.PROVIDER_ID,
      ];
    }

    // https://github.com/firebase/firebaseui-web#configure-oauth-providers
    const config = {
      signInFlow: 'popup',
      signInOptions,
      signInSuccessUrl: window.location.href,
      credentialHelper: 'none',
      tosUrl: `${window.location.origin}/terms`,
      // Privacy policy url/callback.
      privacyPolicyUrl() {
        window.open(`${window.location.origin}/privacy`);
      },
    };
    setFirebaseAuthConfig(config as any);
  }, [app]);

  function signin(email: string, password: string) {
    if (app) {
      app
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('Successfully SignedIn');
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
          {app && firebaseAuthConfig ? (
            <div className="grid justify-center">
              <StyledFirebaseAuth
                uiConfig={firebaseAuthConfig as any}
                firebaseAuth={app.auth()}
              />
              {!full && (
                <Link href="/user/profile">
                  <a>
                    <div className="firebaseui-container firebaseui-page-provider-sign-in firebaseui-id-page-provider-sign-in firebaseui-use-spinner">
                      <div className="firebaseui-card-content">
                        <ul className="firebaseui-idp-list">
                          <li className="firebaseui-list-item">
                            <button
                              className="firebaseui-idp-button mdl-button mdl-js-button mdl-button--raised firebaseui-id-idp-button"
                              style={{ backgroundColor: '#5e1186' }}
                            >
                              <span className="firebaseui-idp-icon-wrapper">
                                <svg
                                  width="16"
                                  height="16"
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
                              </span>
                              <span className="firebaseui-idp-text firebaseui-idp-text-long">
                                All Sign in Options
                              </span>
                              <span className="firebaseui-idp-text firebaseui-idp-text-short">
                                GitHub
                              </span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </a>
                </Link>
              )}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default FirebaseAuth;
