import * as React from 'react';
import { useAuth, useSigninCheck } from 'reactfire';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  Auth,
  User,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';
import Facebook from './global/icons/socials/Facebook';
import Twitter from './global/icons/socials/Twitter';
import GitHub from './global/icons/socials/GitHub';

const signOut = (auth: Auth) =>
  auth.signOut().then(() => console.log('signed out'));

const signInGoogle = async (auth: Auth) => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

const signInFacebook = async (auth: Auth) => {
  const provider = new FacebookAuthProvider();
  await signInWithRedirect(auth, provider);
};
const signInTwitter = async (auth: Auth) => {
  const provider = new TwitterAuthProvider();
  await signInWithRedirect(auth, provider);
};
const signInGitHub = async (auth: Auth) => {
  const provider = new GithubAuthProvider();
  await signInWithRedirect(auth, provider);
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
            className="inline w-4 h-4 mr-3 text-gray-900 fill-current"
            viewBox="0 0 48 48"
            width="48px"
            height="48px"
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
          <Facebook fill="#BC2261" />
          Sign in with Facebook
        </button>
        <button
          onClick={() => signInTwitter(auth)}
          className="flex items-center gap-2 btn-secondary"
        >
          <Twitter fill="#BC2261" />
          Sign in with Twitter
        </button>
        <button
          onClick={() => signInGitHub(auth)}
          className="flex items-center gap-2 btn-secondary"
        >
          <GitHub fill="#BC2261" />
          Sign in with Twitter
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

  if (signedIn === true) {
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
