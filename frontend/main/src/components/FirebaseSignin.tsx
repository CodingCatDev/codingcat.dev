import AJPrimary from './global/icons/AJPrimary';
import {
  getAuth,
  signInWithPopup,
  AuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getApp } from '@firebase/app';

function FirebaseSignin(): JSX.Element {
  const app = getApp();
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  return (
    <>
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex flex-wrap justify-center">
            <AJPrimary />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-basics-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="px-4 py-8 shadow bg-basics-50 sm:rounded-lg sm:px-10">
            {/* <FirebaseAuth /> */}
            <button
              className="btn-primary"
              onClick={() => signInWithPopup(auth, provider)}
            >
              Google Signin
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default FirebaseSignin;
