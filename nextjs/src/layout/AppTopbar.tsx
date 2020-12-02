import { useState } from 'react';
import Link from 'next/link';
import ActiveLink from '@/components/ActiveLink';
import { Transition } from '@headlessui/react';
import OutsideClick from '@/components/OutsideClick';
import TitleLogo from '@/components/global/logos/TitleLogo';

export const AppTopbar = (props) => {
  const { setOverlayMenuActive, overlayMenuActive } = props;

  const [userMenu, setUserMenu] = useState(false);

  return (
    <nav className="bg-ccd-purples-900">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex items-center flex-shrink-0">
              <Link href="/">
                <a>
                  <TitleLogo ajFaceStandard={false} />
                </a>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              <ActiveLink activeClassName="bg-ccd-purples-900" href="/courses">
                <a className="px-3 py-2 text-sm font-medium text-white rounded-md ">
                  Courses
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName="bg-ccd-purples-900"
                href="/tutorials"
              >
                <a className="px-3 py-2 text-sm font-medium text-white rounded-md ">
                  Tutorials
                </a>
              </ActiveLink>
              <ActiveLink activeClassName="bg-ccd-purples-900" href="/blog">
                <a className="px-3 py-2 text-sm font-medium text-white rounded-md ">
                  Blog
                </a>
              </ActiveLink>
              <ActiveLink activeClassName="bg-ccd-purples-900" href="/podcasts">
                <a className="px-3 py-2 text-sm font-medium text-white rounded-md ">
                  Podcasts
                </a>
              </ActiveLink>
              <ActiveLink
                activeClassName="bg-ccd-purples-900"
                href="/community"
              >
                <a className="px-3 py-2 text-sm font-medium text-white rounded-md ">
                  Community
                </a>
              </ActiveLink>
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <button className="p-1 rounded-full bg-ccd-purples-800 text-ccd-basics-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ccd-purples-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                {/* Heroicon name: bell --> */}
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

              {/* Profile dropdown --> */}
              <OutsideClick toggle={setUserMenu} value={false}>
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
                      >
                        Sign out
                      </a>
                    </div>
                  </Transition>
                </div>
              </OutsideClick>
            </div>
            <div className="flex items-center">
              <button
                className="inline-flex items-center justify-center p-2 text-xl text-white rounded-md hover:text-white hover:bg-ccd-purples-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-expanded="false"
                onClick={() => setOverlayMenuActive(!overlayMenuActive)}
              >
                <span className="sr-only">Open main menu</span>
                {!overlayMenuActive ? (
                  <svg
                    className="block w-8 h-8"
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
                    className="block w-8 h-8"
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
        </div>
      </div>

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
    </nav>
  );
};
