import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import firebase from 'firebase/app';
import initFirebase from '../initFirebase';
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from './userCookies';
import { mapUserData } from './mapUserData';
import { userProfileDataObservable } from '@/services/api';
import { Observable } from 'rxjs';

initFirebase();

const useUser = () => {
  const [user, setUser] = useState();
  const [userProfile, setUserProfile]: [Observable<unknown>, any] = useState(
    null
  );
  const router = useRouter();

  const signout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.push('/');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = firebase
      .auth()
      .onIdTokenChanged(async (user) => {
        if (user) {
          const userData = await mapUserData(user);
          setUserCookie(userData);
          setUser(userData as any);
          setUserProfile(userProfileDataObservable(userData.id));
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
    setUserProfile(userProfileDataObservable(userFromCookie.id));

    return () => {
      cancelAuthListener();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, signout, userProfile };
};

export { useUser };
