import Link from 'next/link';
import dynamic from 'next/dynamic';

import { useUser } from '@/utils/auth/useUser';
import ActiveLink from '@/components/ActiveLink';
import { Transition } from '@headlessui/react';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

export default function UserSignin({ userMenu, setUserMenu }) {
  const { user, signout }: { user: any; signout: any } = useUser();

  return (
    <>
      <div className="relative ml-3">
        <div>
          <button
            className="flex text-sm rounded-full bg-ccd-purples-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-purples-800 focus:ring-white"
            id="user-menu"
            aria-haspopup="true"
            onClick={() => setUserMenu(!userMenu)}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </button>
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
