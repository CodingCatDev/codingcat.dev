import ActiveLink from '@/components/ActiveLink';
import TitleLogo from '@/components/global/logos/TitleLogo';
import OutsideClick from '@/components/OutsideClick';
import { Dispatch, SetStateAction } from 'react';
import AvatarMenu from '@/components/user/AvatarMenu';
import { useSigninCheck } from 'reactfire';

export default function AppMenu({
  setOverlayMenuActive,
  overlayMenuActive,
  userMenu,
  setUserMenu,
}: {
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
  userMenu: boolean;
  setUserMenu: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const { data: signInCheckResult } = useSigninCheck();

  return (
    <div
      className={`${
        overlayMenuActive
          ? 'fixed inset-0 bg-primary-100 bg-opacity-70 z-50'
          : 'hidden'
      }`}
    >
      <OutsideClick toggle={setOverlayMenuActive} value={false}>
        <section
          className="absolute inset-y-0 right-0 grid grid-cols-1"
          aria-labelledby="slide-over-heading"
        >
          <section className="grid h-full grid-cols-1 shadow-xl grid-rows-sidebar bg-primary-900 dark:bg-primary-900">
            <section className="flex items-center gap-4 p-4 space-between bg-primary-800 dark:bg-primary-800">
              <ActiveLink href="/">
                <a>
                  <TitleLogo ajFaceStandard={false} />
                </a>
              </ActiveLink>

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
            <section className="flex self-end p-4 bg-primary-700 dark:bg-primary-700">
              <div className="flex items-center cursor-pointer links-secondary">
                <OutsideClick toggle={setUserMenu} value={false}>
                  <AvatarMenu
                    userMenu={userMenu}
                    setUserMenu={setUserMenu}
                    positionClass="left-0 bottom-0 mb-6"
                  />
                </OutsideClick>
                {signInCheckResult && signInCheckResult.signedIn === true && (
                  <OutsideClick toggle={setUserMenu} value={false}>
                    <button className="ml-2" onClick={() => setUserMenu(true)}>
                      <p className="text-sm font-medium text-left text-basics-50 dark:text-basics-50">
                        {signInCheckResult.user?.displayName}
                      </p>
                      <p className="text-xs font-medium text-left text-basics-200 dark:text-basics-200 group-hover:text-basics-200">
                        {signInCheckResult.user?.email}
                      </p>
                    </button>
                  </OutsideClick>
                )}
              </div>
            </section>
          </section>
        </section>
      </OutsideClick>
      {/* </div> */}
    </div>
  );
}
