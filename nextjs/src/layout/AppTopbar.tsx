import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import OutsideClick from '@/components/OutsideClick';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import NavLinks from '../layout/NavLinks';
import SearchModal from '@/components/algolia/SearchModal';

// STYLES

const AvatarMenu = dynamic(() => import('@/components/User/AvatarMenu'), {
  ssr: false,
  loading: () => <div className="w-8 h-8 bg-white rounded-full"></div>,
});

export const AppTopbar = (props: {
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
}) => {
  const { setOverlayMenuActive, overlayMenuActive } = props;

  const [userMenu, setUserMenu] = useState(false);

  return (
    <header className="flex justify-between w-full h-20 p-4 space-x-10 md:px-0 md:mx-auto">
      <Link href="/">
        <a>
          <div className="flex items-center content-center flex-shrink-0 h-full">
            <AJLogoLeft />
            <h6 className="hidden text-white lg:block">CodingCat.dev</h6>
          </div>
        </a>
      </Link>
      {/* <div className="flex justify-between h-16"> */}
      <NavLinks />
      <div className="flex items-center justify-end">
        <div className="flex items-center w-full space-x-2">
          <SearchModal />
          <button className="p-1 rounded-full text-ccd-yellows-400 hover:bg-ccd-purples-700 focus:outline-none focus:ring-2 focus:ring-ccd-basics-050">
            <span className="sr-only">View notifications</span>
            {/* Heroicon name: bell --> */}
            <svg
              className="w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          {/* Profile dropdown --> */}
          <OutsideClick toggle={setUserMenu} value={false}>
            <AvatarMenu userMenu={userMenu} setUserMenu={setUserMenu} />
          </OutsideClick>
        </div>
        <div className="flex items-center ml-2">
          <button
            className="inline-flex items-center justify-center p-1 text-xl rounded-md text-ccd-basics-050 hover:text-white hover:bg-ccd-purples-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-expanded="false"
            onClick={() => setOverlayMenuActive(!overlayMenuActive)}
          >
            <span className="sr-only">Open main menu</span>
            {!overlayMenuActive ? (
              <svg
                className="block w-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block w-10"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* </div> */}

      {/*
        Mobile menu, toggle classNamees based on menu state.
    
        Menu open: "block", Menu closed: "hidden"
      --> 
      <div className="hidden md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium text-white rounded-md bg-ccd-purples-500"
          >
            Dashboard
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium rounded-md text-ccd-basics-300 hover:text-white hover:bg-ccd-purples-700"
          >
            Team
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium rounded-md text-ccd-basics-300 hover:text-white hover:bg-ccd-purples-700"
          >
            Projects
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-base font-medium rounded-md text-ccd-basics-300 hover:text-white hover:bg-ccd-purples-700"
          >
            Calendar
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-ccd-basics-700">
          <div className="flex items-center px-5 sm:px-6">
            <div className="flex-shrink-0">
              <img
                className="w-10 h-10 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">Tom Cook</div>
              <div className="text-sm font-medium text-ccd-basics-400">
                tom@example.com
              </div>
            </div>
            <button className="flex-shrink-0 p-1 ml-auto rounded-full bg-ccd-purples-800 text-ccd-basics-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-purples-800 focus:ring-white">
              <span className="sr-only">View notifications</span>
              {/* Heroicon name: bell --> 
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>
          </div>
          <div className="px-2 mt-3 sm:px-3">
            <a
              href="#"
              className="block px-3 py-2 space-y-1 text-base font-medium rounded-md text-ccd-basics-400 hover:text-white hover:bg-ccd-purples-700"
            >
              Your Profile
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium rounded-md text-ccd-basics-400 hover:text-white hover:bg-ccd-purples-700"
            >
              Settings
            </a>
            <a
              href="#"
              className="block px-3 py-2 text-base font-medium rounded-md text-ccd-basics-400 hover:text-white hover:bg-ccd-purples-700"
            >
              Sign out
            </a>
          </div>
        </div>
      </div>;*/}
    </header>
  );
};
