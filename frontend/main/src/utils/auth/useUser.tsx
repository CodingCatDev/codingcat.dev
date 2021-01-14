import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import initFirebase from '@/utils/initFirebase';
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from './userCookies';
import { mapUserData } from './mapUserData';
import { userDataObservable } from '@/services/api';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import firebase from 'firebase/app';
import { UserInfoExtended } from '@/models/user.model';

const useUser = () => {
  const [app, setApp] = useState<firebase.app.App>();
  const [user, setUser] = useState<UserInfoExtended | null>();
  const [userProfile] = useState<Observable<firebase.UserInfo> | null>(null);
  const router = useRouter();

  const signout = async () => {
    if (app) {
      return app
        .auth()
        .signOut()
        .then(() => {
          // Sign-out successful.
          router.push('/');
        })
        .catch((e) => {
          console.error(e);
        });
    }
  };

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
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    if (app) {
      const cancelAuthListener = app.auth().onIdTokenChanged(async (user) => {
        if (user) {
          userDataObservable(user.uid)
            .pipe(take(1))
            .subscribe(async (u) => {
              const userData = await mapUserData(user);
              const utoken = { ...u, ...userData };
              setUserCookie(utoken);
              setUser(utoken);
            });
        } else {
          removeUserCookie();
          setUser(null);
        }
      });

      const userFromCookie = getUserFromCookie();
      if (!userFromCookie) {
        return;
      }
      setUser(userFromCookie);

      return () => {
        cancelAuthListener();
      };
    }
  }, [app]);

  return { user, signout, userProfile, app };
};

export { useUser };
