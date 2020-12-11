import Link from 'next/link';

import { useUser } from '@/utils/auth/useUser';
import ActiveLink from '@/components/ActiveLink';
import { Transition } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Observable, Subscription } from 'rxjs';
import { UserInfo } from '@/models/userInfo.model';
import { userProfileDataObservable } from '@/services/api';
import firebase from 'firebase/app';
import { authState } from 'rxfire/auth';
import { takeWhile, switchMap } from 'rxjs/operators';

export default function UserSignin({
  userMenu,
  setUserMenu,
}: {
  userMenu: boolean;
  setUserMenu: Dispatch<SetStateAction<boolean>>;
}) {
  const { user, signout } = useUser();

  const [profile, setProfile] = useState<UserInfo | null>(null);

  let subscription: Subscription;
  useEffect(() => {
    subscription = authState(firebase.auth())
      .pipe(
        takeWhile((user) => {
          if (!user && subscription) {
            subscription.unsubscribe();
          }
          return user != null;
        }),
        switchMap((u: firebase.UserInfo) => {
          console.log(u);
          return userProfileDataObservable(u.uid);
        })
      )
      .subscribe((profile) => {
        console.log(profile);
        setProfile(profile);
      });
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <>
      <div className="relative ml-3">
        <div>
          {user ? (
            <button
              className="flex text-sm rounded-full bg-ccd-purples-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-purples-800 focus:ring-white"
              id="user-menu"
              aria-haspopup="true"
              onClick={() => setUserMenu(!userMenu)}
            >
              <span className="sr-only">Open user menu</span>
              {profile && profile.photoURL ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={profile.photoURL}
                  alt={
                    profile.displayName
                      ? profile.displayName
                      : 'A Good Description'
                  }
                />
              ) : (
                <img
                  className="w-8 h-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              )}
            </button>
          ) : (
            <Link href="/user/profile">
              <a className="flex items-center justify-center p-2 text-white rounded bg-ccd-purples-900 hover:bg-ccd-purples-700">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <div>Sign In</div>
              </a>
            </Link>
          )}
        </div>
        <Transition
          show={userMenu}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div
            className="absolute right-0 z-40 w-48 p-2 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu"
          >
            <ActiveLink
              activeClassName="border-2 border-ccd-purples-800 rounded bg-ccd-purples-100 first-child:text-white"
              href="/user/profile"
            >
              <a
                className="block px-4 py-2 text-sm text-ccd-basics-700 hover:bg-ccd-purples-100"
                role="menuitem"
              >
                Your Profile
              </a>
            </ActiveLink>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-ccd-basics-700 hover:bg-ccd-purples-100"
              role="menuitem"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-ccd-basics-700 hover:bg-ccd-purples-100"
              role="menuitem"
              onClick={() => signout()}
            >
              Sign out
            </a>
          </div>
        </Transition>
      </div>
    </>
  );
}
