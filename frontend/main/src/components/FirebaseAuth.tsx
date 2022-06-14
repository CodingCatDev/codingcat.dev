import * as React from 'react';
import { useAuth, useSigninCheck } from 'reactfire';
import {
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
  User,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import Facebook from './global/icons/socials/Facebook';
import Twitter from './global/icons/socials/Twitter';
import GitHub from './global/icons/socials/GitHub';

export const signOut = (auth: Auth) =>
  auth.signOut().then(() => {
    console.log('signed out');
    window.location.href = '/';
  });

const signInGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider, browserPopupRedirectResolver);
};
const signInFacebook = async (auth: Auth) => {
  const provider = new FacebookAuthProvider();
  await signInWithPopup(auth, provider, browserPopupRedirectResolver);
};
const signInTwitter = async (auth: Auth) => {
  const provider = new TwitterAuthProvider();
  await signInWithPopup(auth, provider, browserPopupRedirectResolver);
};
const signInGitHub = async (auth: Auth) => {
  const provider = new GithubAuthProvider();
  await signInWithPopup(auth, provider, browserPopupRedirectResolver);
};
const signInMicrosoft = async (auth: Auth) => {
  const provider = new OAuthProvider('microsoft.com');
  await signInWithPopup(auth, provider, browserPopupRedirectResolver);
};
const signInApple = async (auth: Auth) => {
  const provider = new OAuthProvider('apple.com');
  await signInWithPopup(auth, provider, browserPopupRedirectResolver);
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

const UserDetails = ({ user }: { user: User }) => {
  const auth = useAuth();

  return (
    <>
      {(user as User).displayName}

      <ul>
        {(user as User).providerData?.map((profile) => (
          <li key={profile?.providerId}>{profile?.providerId}</li>
        ))}
      </ul>
      <button
        onClick={() => signOut(auth)}
        className="px-6 py-3 mt-4 font-semibold text-gray-900 bg-white border-2 border-gray-500 rounded-md shadow outline-none hover:bg-blue-50 hover:border-blue-400 focus:outline-none"
      >
        Sign Out
      </button>
    </>
  );
};

const SignInForm = () => {
  const auth = useAuth();

  return (
    <div className="flex justify-center">
      <div className="grid gap-2 m-2">
        <button
          onClick={() => signInGoogle(auth)}
          className="flex items-center gap-2 btn-secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="inline w-8 h-8 mr-3 "
            viewBox="0 0 48 48"
          >
            <path
              fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20 s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
            <path
              fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039 l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            ></path>
            <path
              fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            ></path>
            <path
              fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            ></path>
          </svg>
          Sign in with Google
        </button>
        <button
          onClick={() => signInFacebook(auth)}
          className="flex items-center gap-2 btn-secondary"
        >
          <svg
            className="inline w-8 h-8 mr-3 "
            viewBox="0 0 20 20"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              d="M18.007 19c.55 0 .993-.444.993-.993V1.993A.992.992 0 0018.007 1H1.993A.992.992 0 001 1.993v16.014c0 .55.444.993.993.993h16.014zm-4.587 0v-6.97h2.34l.35-2.717h-2.69V7.578c0-.786.218-1.322 1.346-1.322h1.438v-2.43a18.915 18.915 0 00-2.096-.108c-2.073 0-3.494 1.267-3.494 3.59v2.005H8.268v2.717h2.346V19h2.806z"
              fill="#3B5998"
              fillRule="evenodd"
            ></path>
          </svg>{' '}
          Sign in with Facebook
        </button>
        <button
          onClick={() => signInTwitter(auth)}
          className="flex items-center gap-2 btn-secondary"
        >
          <svg
            height="100%"
            viewBox="0 0 20 20"
            width="100%"
            className="inline w-8 h-8 mr-3 "
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              d="M20 3.924a8.212 8.212 0 01-2.357.646 4.111 4.111 0 001.804-2.27c-.792.47-1.67.812-2.605.996A4.103 4.103 0 009.85 7.038a11.645 11.645 0 01-8.458-4.287 4.118 4.118 0 00-.555 2.066 4.1 4.1 0 001.825 3.415 4.074 4.074 0 01-1.858-.513v.052a4.105 4.105 0 003.29 4.022 4.01 4.01 0 01-1.852.072 4.106 4.106 0 003.833 2.85A8.268 8.268 0 010 16.411a11.602 11.602 0 006.29 1.846c7.547 0 11.674-6.253 11.674-11.675 0-.18-.004-.355-.01-.53.8-.58 1.496-1.3 2.046-2.125"
              fill="#55ACEE"
              fillRule="evenodd"
            ></path>
          </svg>{' '}
          Sign in with Twitter
        </button>
        <button
          onClick={() => signInGitHub(auth)}
          className="flex items-center gap-2 btn-secondary"
        >
          <svg
            viewBox="0 0 20 20"
            className="inline w-8 h-8 mr-3 "
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              d="M10 0C4.476 0 0 4.477 0 10c0 4.418 2.865 8.166 6.84 9.49.5.09.68-.218.68-.483 0-.237-.007-.866-.012-1.7-2.782.603-3.37-1.34-3.37-1.34-.454-1.157-1.11-1.464-1.11-1.464-.907-.62.07-.608.07-.608 1.003.07 1.53 1.03 1.53 1.03.893 1.53 2.342 1.087 2.912.83.09-.645.35-1.085.634-1.335-2.22-.253-4.555-1.11-4.555-4.943 0-1.09.39-1.984 1.03-2.683-.105-.253-.448-1.27.096-2.647 0 0 .84-.268 2.75 1.026A9.555 9.555 0 0110 4.836a9.59 9.59 0 012.504.337c1.91-1.294 2.747-1.026 2.747-1.026.548 1.377.204 2.394.1 2.647.64.7 1.03 1.592 1.03 2.683 0 3.842-2.34 4.687-4.566 4.935.36.308.678.92.678 1.852 0 1.336-.01 2.415-.01 2.743 0 .267.18.578.687.48A10 10 0 0020 10c0-5.522-4.478-10-10-10"
              fill="#191717"
              fillRule="evenodd"
            ></path>
          </svg>{' '}
          Sign in with GitHub
        </button>
        <button
          onClick={() => signInMicrosoft(auth)}
          className="flex items-center gap-2 btn-secondary"
        >
          <svg
            viewBox="0 0 20 20"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
            className="inline w-8 h-8 mr-3 "
          >
            <g fill="none">
              <path d="M0 0h9.504v9.504H0z" fill="#F25022"></path>
              <path d="M10.496 0H20v9.504h-9.504z" fill="#7FBA00"></path>
              <path d="M0 10.496h9.504V20H0z" fill="#00A4EF"></path>
              <path d="M10.496 10.496H20V20h-9.504z" fill="#FFB900"></path>
            </g>
          </svg>
          Sign in with Microsoft
        </button>
        <button
          onClick={() => signInApple(auth)}
          className="flex items-center gap-2 btn-secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 814 1000"
            xmlSpace="preserve"
            className="inline w-8 h-8 mr-3 "
          >
            <path d="M788 341c-6 4-108 62-108 190 0 149 130 201 134 203-1 3-21 71-69 141-42 62-87 124-155 124s-86-40-164-40c-77 0-104 41-166 41s-106-57-156-127A612 612 0 0 1 0 542c0-195 126-298 251-298 66 0 121 44 163 44 39 0 101-46 176-46 28 0 131 2 198 99zM554 159c31-36 53-88 53-139 0-7 0-14-2-20-50 2-110 34-147 76-28 32-55 83-55 135l2 18 14 2c45 0 102-31 135-72z" />
          </svg>{' '}
          Sign in with Apple
        </button>
      </div>
    </div>
  );
};
export const FirebaseAuth = () => {
  const { status, data: signinResult } = useSigninCheck();

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  const { signedIn, user } = signinResult;

  if (signedIn === true && user) {
    return <UserDetails user={user} />;
  } else {
    return <SignInForm />;
  }
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
