import ActiveLink from '@/components/ActiveLink';
import TitleLogo from '@/components/global/logos/TitleLogo';
import OutsideClick from '@/components/OutsideClick';
import { Transition } from '@headlessui/react';
import { ComponentType, Dispatch, SetStateAction } from 'react';

export const AppMenu: ComponentType<{
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
}> = (props) => {
  const { setOverlayMenuActive, overlayMenuActive } = props;

  return (
    <Transition
      show={overlayMenuActive}
      enter="transition-opacity duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-75"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="z-50 fixed inset-0 overflow-hidden bg-purple-100 bg-opacity-70">
        <div className="absolute inset-0 overflow-hidden">
          <OutsideClick toggle={setOverlayMenuActive} value={false}>
            <section
              className="absolute inset-y-0 right-0 flex max-w-full"
              aria-labelledby="slide-over-heading"
            >
              <div className="w-screen max-w-md">
                <div className="flex flex-col h-full shadow-xl bg-gray-800">
                  <div className="flex flex-col flex-1 w-full h-0 bg-purple-700">
                    <div className="flex flex-col flex-1 pb-4 overflow-y-auto">
                      <div className="flex items-center justify-between h-16 mx-4">
                        <div className="flex items-center flex-shrink-0">
                          <ActiveLink href="/">
                            <a>
                              <TitleLogo ajFaceStandard={false} />
                            </a>
                          </ActiveLink>
                        </div>

                        <button
                          className="inline-flex items-center justify-center p-2 text-xl text-white rounded-md hover:text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                          aria-expanded="false"
                          onClick={() =>
                            setOverlayMenuActive(!overlayMenuActive)
                          }
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

                      <nav
                        className="flex-1 px-2 space-y-1 bg-purple-800"
                        aria-label="Sidebar"
                      >
                        <ActiveLink
                          activeClassName="bg-purple-900"
                          href="/courses"
                        >
                          <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-purple-800 ">
                            Courses
                          </a>
                        </ActiveLink>
                        <ActiveLink
                          activeClassName="bg-purple-900"
                          href="/tutorials"
                        >
                          <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-purple-800 ">
                            Tutorials
                          </a>
                        </ActiveLink>
                        <ActiveLink
                          activeClassName="bg-purple-900"
                          href="/blog"
                        >
                          <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-purple-800 ">
                            Blog
                          </a>
                        </ActiveLink>
                        <ActiveLink
                          activeClassName="bg-purple-900"
                          href="/podcasts"
                        >
                          <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-purple-800 ">
                            Podcasts
                          </a>
                        </ActiveLink>
                        <ActiveLink
                          activeClassName="bg-purple-900"
                          href="/community"
                        >
                          <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-purple-800 ">
                            Community
                          </a>
                        </ActiveLink>
                      </nav>
                    </div>
                    <div className="flex flex-shrink-0 p-4 bg-purple-700">
                      <a href="#" className="flex-shrink-0 block w-full group">
                        <div className="flex items-center">
                          <div>
                            <img
                              className="inline-block rounded-full h-9 w-9"
                              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                              alt=""
                            />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-white">
                              Tom Cook
                            </p>
                            <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                              View profile
                            </p>
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </OutsideClick>
        </div>
      </div>
    </Transition>
  );
};
