import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import OutsideClick from '@/components/OutsideClick';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import NavLinks from '../layout/NavLinks';
import SearchModal from '@/components/algolia/SearchModal';
import AvatarMenu from '@/components/User/AvatarMenu';

export const AppTopbar = (props: {
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
}) => {
  const { setOverlayMenuActive, overlayMenuActive } = props;

  const [userMenu, setUserMenu] = useState(false);

  return (
    <header className="flex justify-between w-full h-20 p-4 md:px-0 md:mx-auto">
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
          <button className="p-1 text-white rounded-full hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-gray-050">
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
            className="inline-flex items-center justify-center p-1 text-xl rounded-md text-gray-050 hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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
    </header>
  );
};
