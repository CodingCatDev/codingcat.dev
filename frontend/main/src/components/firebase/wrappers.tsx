import {
  connectAuthEmulator,
  getAuth,
  getIdToken,
  onIdTokenChanged,
} from '@firebase/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  FirestoreSettings,
  getFirestore,
} from '@firebase/firestore';
import {
  useFirebaseApp,
  AuthProvider,
  FirestoreProvider,
  FirebaseAppProvider,
  FunctionsProvider,
} from 'reactfire';
import { config, emulation } from '@/config/firebase';
import { getFunctions } from '@firebase/functions';
import { connectFunctionsEmulator } from 'firebase/functions';
import { useEffect } from 'react';
import {
  getUserFromCookie,
  removeUserCookie,
  setUserCookie,
} from '@/utils/auth/userCookies';
import { UserInfoExtended } from '@/models/user.model';
interface FirestoreExt extends Firestore {
  _settings: FirestoreSettings;
}

export const FirebaseProvider = ({ children }: { children: JSX.Element }) => {
  return (
    <FirebaseAppProvider firebaseConfig={config}>
      {children}
    </FirebaseAppProvider>
  );
};

export const FirebaseAuthProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const app = useFirebaseApp();
  const auth = getAuth(app);
  if (emulation.authEmulatorHost && !auth.emulatorConfig) {
    connectAuthEmulator(auth, emulation.authEmulatorHost);
  }

  interface ZaUser extends UserInfoExtended {
    za?: string;
  }

  useEffect(() => {
    const cancelAuthListener = onIdTokenChanged(auth, async (user) => {
      if (user) {
        const userFromCookie = getUserFromCookie();
        const token = await getIdToken(user);
        if (!userFromCookie || token !== userFromCookie.token) {
          setUserCookie({ token });
        }
      } else {
        removeUserCookie();
      }
    });

    return () => {
      cancelAuthListener();
    };
  }, [auth]);

  return <AuthProvider sdk={auth}>{children}</AuthProvider>;
};

export const FirebaseFirestoreProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const app = useFirebaseApp();
  const firestore = getFirestore(app) as FirestoreExt;
  if (
    emulation.firestoreEmulatorHost &&
    firestore?._settings?.host != emulation.firestoreEmulatorHost
  ) {
    const { urn, port } = hostSplitter(emulation.firestoreEmulatorHost);
    if (urn && port) {
      connectFirestoreEmulator(firestore, urn, port);
    }
  }
  return <FirestoreProvider sdk={firestore}>{children}</FirestoreProvider>;
};

export const FirebaseFunctionsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const app = useFirebaseApp();
  const functions = getFunctions(app);
  if (emulation.cloudFunctionsEmulatorHost) {
    const { urn, port } = hostSplitter(emulation.cloudFunctionsEmulatorHost);
    if (urn && port) {
      connectFunctionsEmulator(functions, urn, port);
    }
  }
  return <FunctionsProvider sdk={functions}>{children}</FunctionsProvider>;
};

const hostSplitter = (host: string) => {
  const split = host.split(':');
  let urn = '';
  let port = 0;
  if (split && split.length == 2) {
    urn = split[0];
    port = parseInt(split[1]);
    if (isNaN(port)) {
      port = 0;
    }
  }
  return { urn, port };
};
