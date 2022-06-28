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
  PerformanceProvider,
  AnalyticsProvider,
} from 'reactfire';
import { config, emulation } from '@/config/firebase';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

import { UserInfoExtended } from '@/models/user.model';
import { getPerformance } from '@firebase/performance';
import { getAnalytics } from '@firebase/analytics';
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

export const FirebasePerformanceProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const app = useFirebaseApp();
  const perf = getPerformance(app);
  return <PerformanceProvider sdk={perf}>{children}</PerformanceProvider>;
};

export const FirebaseAnalyticsProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const app = useFirebaseApp();
  const analytics = getAnalytics();
  return <AnalyticsProvider sdk={analytics}>{children}</AnalyticsProvider>;
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
  const functions = getFunctions();
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
