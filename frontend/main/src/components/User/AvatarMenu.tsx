import Link from 'next/link';

import { useUser } from '@/utils/auth/useUser';
import ActiveLink from '@/components/ActiveLink';
import { Transition } from '@headlessui/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Observable, Subscription } from 'rxjs';
import { UserInfo } from '@/models/userInfo.model';
import { userProfileDataObservable } from '@/services/api';
import firebaseApp from 'firebase/app';
import { authState } from 'rxfire/auth';
import { takeWhile, switchMap } from 'rxjs/operators';

export default function UserSignin({
  userMenu,
  setUserMenu,
}: {
  userMenu: boolean;
  setUserMenu: Dispatch<SetStateAction<boolean>>;
}) {
  const { user, signout, app } = useUser();

  const [profile, setProfile] = useState<UserInfo | null>(null);

  let subscription: Subscription;
  useEffect(() => {
    if (app) {
      subscription = authState(app.auth())
        .pipe(
          takeWhile((user) => {
            if (!user && subscription) {
              subscription.unsubscribe();
            }
            return user != null;
          }),
          switchMap((u: firebaseApp.UserInfo) =>
            userProfileDataObservable(u.uid)
          )
        )
        .subscribe((profile) => setProfile(profile));
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [app]);

  return (
    <>
      <div className="relative">
        {user ? (
          <button
            className="flex p-1 text-sm rounded-full text-basics-50 dark:text-basics-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary-800 focus:ring-basics-50 hover:bg-primary-800 dark:hover:bg-primary-800 dark:hover:text-basics-50"
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
                src="/static/images/avatar.png"
                alt=""
              />
            )}
          </button>
        ) : (
          <Link href="/user/profile">
            <a className="flex items-center justify-center p-2 rounded text-basics-50 dark:text-basics-50 hover:bg-primary-800 dark:hover:bg-primary-800 hover:text-basics-50 dark:hover:text-basics-50 focus:ring-2 focus:ring-basics-50">
              <svg
                width="20"
                height="20"
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
              <span className="ml-2 hover:text-basics-50 dark:hover:text-basics-50 space-nowrap">
                Sign In
              </span>
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
          className="absolute right-0 z-40 w-48 p-2 py-1 mt-2 origin-top-right rounded-md shadow-lg bg-basics-50 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu"
        >
          <ActiveLink
            activeClassName="rounded first-child:text-primary-900"
            href="/user/profile"
          >
            <a
              className="flex items-center p-2 text-sm text-basics-900 dark:text-basics-900 hover:bg-primary-50 dark:hover:bg-primary-50"
              role="menuitem"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <path
                  d="M7.284 6.61h0v-.002c0-1.792.439-3.218 1.278-4.316C9.38 1.222 10.505.682 12 .682s2.62.54 3.438 1.61c.84 1.098 1.278 2.524 1.278 4.316v.002c.01 2.21-.695 3.912-2.085 5.166h0l-.008.008c-.332.312-.439.726-.352 1.16l.012.062.027.056.39.815c.165.356.413.644.742.85.296.187.86.422 1.638.703h0l.012.004 2.16.7c.701.228 1.237.403 1.608.527a30.83 30.83 0 01.564.195l.015.008.016.006c.9.376 1.405.73 1.629 1.029.115.288.223.834.299 1.694.068.782.107 1.78.115 2.998H.502c.008-1.218.047-2.216.115-2.998.076-.86.184-1.406.3-1.694.223-.298.727-.653 1.628-1.029l.015-.006.016-.008c-.005.003-.003.002.01-.003l.124-.045a188.548 188.548 0 012.038-.673 2112.8 2112.8 0 002.16-.7h0l.012-.005c.777-.281 1.342-.516 1.639-.703.328-.206.576-.494.74-.85l.39-.815.028-.056.012-.062c.087-.434-.02-.848-.352-1.16h0l-.008-.008C7.979 10.522 7.273 8.82 7.284 6.61zm7.682 5.538c1.511-1.364 2.261-3.21 2.25-5.54l-2.455 6.238c-.056-.284.012-.517.205-.698z"
                  fill="url(#paint0_linear)"
                  stroke="#141214"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1={0}
                    y1={0.181641}
                    x2={-7.75833e-8}
                    y2={23.0907}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#5E1286" />
                    <stop offset={1} stopColor="#C5235D" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="ml-2">Your Profile</span>
            </a>
          </ActiveLink>
          <a
            href="#"
            className="flex items-center p-2 text-sm text-basics-900 hover:bg-primary-50"
            role="menuitem"
          >
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <path
                d="M6.166 16.066h0l-.003.004a1.25 1.25 0 001.768 1.767h0l.003-.003c1.04-1.04 2.816-.304 2.816 1.166a1.25 1.25 0 002.5 0c0-1.468 1.775-2.205 2.815-1.167a1.252 1.252 0 001.781.013 1.25 1.25 0 00-.014-1.781c-1.037-1.04-.302-2.815 1.168-2.815a1.25 1.25 0 100-2.5c-1.47 0-2.206-1.777-1.166-2.816h0l.003-.003a1.25 1.25 0 00-1.768-1.768h0l-.003.003C15.026 7.206 13.25 6.47 13.25 5a1.25 1.25 0 00-2.5 0c0 1.469-1.775 2.205-2.815 1.168a1.25 1.25 0 10-1.767 1.767C7.205 8.975 6.47 10.75 5 10.75a1.25 1.25 0 100 2.5c1.47 0 2.206 1.777 1.166 2.816zm2.679-11.1l.376.325.036-.496a2.75 2.75 0 015.486 0l.036.495.376-.323a2.75 2.75 0 013.877 3.878l-.323.376.495.036a2.75 2.75 0 010 5.486l-.494.036.323.376a2.75 2.75 0 01-3.878 3.877l-.376-.323-.036.495a2.75 2.75 0 01-5.486 0l-.036-.495-.376.323a2.75 2.75 0 01-3.878-3.877l.323-.376-.495-.036a2.75 2.75 0 010-5.486l.496-.036-.325-.376a2.75 2.75 0 013.879-3.878z"
                fill="url(#paint0_linear)"
                stroke="#141214"
                strokeWidth={0.5}
              />
              <path
                d="M12 9.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-2.648-.404a3.75 3.75 0 115.394 5.21 3.75 3.75 0 01-5.394-5.21z"
                fill="url(#paint1_linear)"
                stroke="#141214"
                strokeWidth={0.5}
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1={1.99594}
                  y1={1.99609}
                  x2={1.99594}
                  y2={22.0032}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5E1286" />
                  <stop offset={1} stopColor="#C5235D" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear"
                  x1={8.04915}
                  y1={7.95117}
                  x2={8.04915}
                  y2={15.9512}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5E1286" />
                  <stop offset={1} stopColor="#C5235D" />
                </linearGradient>
              </defs>
            </svg>

            <span className="ml-2">Settings</span>
          </a>
          <a
            href="#"
            className="flex items-center p-2 text-sm text-basics-900 hover:bg-primary-50"
            role="menuitem"
            onClick={() => signout()}
          >
            <svg width={21} height={24} viewBox="0 0 21 24" fill="none">
              <path
                d="M17.6 22.5v.4h2.65a.35.35 0 010 .7H.75a.35.35 0 010-.7H3.4V2.25s0 0 0 0a.35.35 0 01.301-.347h0l10.5-1.5s0 0 0 0A.35.35 0 0114.6.75s0 0 0 0V1.9h1.15a1.85 1.85 0 011.85 1.85V22.5zM15 2.6h-.4V22.9h2.3V3.75a1.15 1.15 0 00-1.15-1.15H15zm-4.9 10.9c0 .463.093.901.262 1.24.157.313.448.66.888.66s.731-.347.888-.66c.169-.339.262-.777.262-1.24 0-.463-.093-.902-.262-1.24-.157-.313-.448-.66-.888-.66s-.731.347-.888.66c-.169.338-.262.777-.262 1.24z"
                fill="url(#paint0_linear)"
                stroke="#141214"
                strokeWidth={0.8}
              />
              <defs>
                <linearGradient
                  id="paint0_linear"
                  x1={0}
                  y1={0}
                  x2={-9.73112e-8}
                  y2={23.9999}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#5E1286" />
                  <stop offset={1} stopColor="#C5235D" />
                </linearGradient>
              </defs>
            </svg>
            <span className="ml-2">Sign out</span>
          </a>
        </div>
      </Transition>
    </>
  );
}
