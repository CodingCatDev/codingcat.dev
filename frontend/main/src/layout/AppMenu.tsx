import ActiveLink from '@/components/ActiveLink';
import TitleLogo from '@/components/global/logos/TitleLogo';
import OutsideClick from '@/components/OutsideClick';
import { Transition } from '@headlessui/react';
import { Dispatch, SetStateAction } from 'react';

export default function AppMenu({
  setOverlayMenuActive,
  overlayMenuActive,
}: {
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
}): JSX.Element {
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
      <div className="fixed inset-0 z-50 overflow-hidden bg-primary-100 bg-opacity-70">
        {/* <div className="absolute inset-0 overflow-hidden"> */}
        <OutsideClick toggle={setOverlayMenuActive} value={false}>
          <section
            className="absolute inset-y-0 right-0 flex max-w-full"
            aria-labelledby="slide-over-heading"
          >
            {/* <div className="w-screen max-w-md">
                <div className="grid h-full shadow-xl bg-basics-800">
                  <div className="flex flex-col flex-1 w-full h-0 bg-secondary-600 dark:bg-secondary-600"> */}
            {/* <div className="flex flex-col flex-1 pb-4 overflow-y-auto">
                      <div className="flex items-center justify-between h-16 mx-4">
                        <div className="flex items-center flex-shrink-0"> */}
            <section className="grid h-full shadow-xl grid-rows-sidebar bg-primary-900 dark:bg-primary-900">
              <section className="flex items-center p-4 space-x-20 space-between bg-primary-800 dark:bg-primary-800">
                <ActiveLink href="/">
                  <a>
                    <TitleLogo ajFaceStandard={false} />
                  </a>
                </ActiveLink>
                {/* </div> */}

                <button
                  className="inline-flex items-center justify-center p-2 text-xl rounded-md text-basics-50 hover:text-basics-50 dark:text-basics-50 dark:hover:text-basics-50 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-basics-50"
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
              </section>
              {/* </div> */}

              <nav
                className="grid content-start h-full gap-4 p-4 bg-primary-900 dark:bg-primary-900"
                aria-label="Sidebar"
              >
                <ActiveLink activeClassName="" href="/courses">
                  <a className="links-secondary">Courses</a>
                </ActiveLink>
                <ActiveLink activeClassName="" href="/tutorials">
                  <a className="links-secondary">Tutorials</a>
                </ActiveLink>
                <ActiveLink activeClassName="" href="/blog">
                  <a className="links-secondary">Blog</a>
                </ActiveLink>
                <ActiveLink activeClassName="" href="/podcasts">
                  <a className="links-secondary">Podcasts</a>
                </ActiveLink>
                <ActiveLink activeClassName="" href="/community">
                  <a className="links-secondary">Community</a>
                </ActiveLink>
              </nav>
              {/* </div> */}
              <div className="flex self-end p-4 bg-primary-700 dark:bg-primary-700">
                <a href="#" className="links-secondary">
                  <div className="flex items-center">
                    <div>
                      <img
                        className="inline-block rounded-full h-9 w-9"
                        src="/static/images/avatar.png"
                        alt=""
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-basics-50 dark:text-basics-50">
                        User Name
                      </p>
                      <p className="text-xs font-medium text-basics-200 dark:text-basics-200 group-hover:text-basics-200">
                        View profile
                      </p>
                    </div>
                  </div>
                </a>
              </div>
              {/* </div> */}
              {/* </div>
              </div> */}
            </section>
          </section>
        </OutsideClick>
        {/* </div> */}
      </div>
    </Transition>
  );
}
