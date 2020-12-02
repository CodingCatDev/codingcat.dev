import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/app';
import 'firebase/auth';
import initFirebase from '@/utils/initFirebase';
import { setUserCookie } from '@/utils/auth/userCookies';
import { mapUserData } from '@/utils/auth/mapUserData';

// Init the Firebase app.
initFirebase();
// Auth providers
// https://github.com/firebase/firebaseui-web#configure-oauth-providers
const firebaseAuthConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
  ],
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      const userData = await mapUserData(user);
      setUserCookie(userData);
    },
  },
};

const firebaseAuthFull = {
  signInFlow: 'popup',
  signInOptions: [
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
  ],
  // signInSuccessUrl: '/',
  credentialHelper: 'none',
  callbacks: {
    signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
      const userData = await mapUserData(user);
      setUserCookie(userData);
    },
  },
};

const FirebaseAuth = ({ full = true }) => {
  return (
    <>
      {full ? (
        <div>
          <StyledFirebaseAuth
            uiConfig={firebaseAuthFull as any}
            firebaseAuth={firebase.auth()}
          />
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
