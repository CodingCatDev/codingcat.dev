import { useState } from 'react';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import AdminNavItems from '@/layout/admin/AdminNavItems';
import OutsideClick from '@/components/OutsideClick';
import AvatarMenu from '@/components/user/AvatarMenu';
import { useUser } from '@/utils/auth/useUser';

export default function AdminMenu(): JSX.Element {
  const [userMenu, setUserMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(true);
  const { user } = useUser();

  function toggleNav() {
    setNavOpen(!navOpen);
  }
  if (navOpen) {
    return (
      <section className="relative z-40 grid h-full grid-cols-1 grid-rows-admin">
        <section className="flex items-center justify-between gap-4 pl-4 bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50">
          <AJLogoLeft />
          <h2 className="hidden mr-4 text-2xl lg:block">CodingCat.dev</h2>
          <button
            className="inline-flex items-center justify-center p-2 text-xl rounded-md text-basics-50 hover:text-basics-50 dark:text-basics-50 dark:hover:text-basics-50 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-basics-50"
            aria-expanded="true"
            onClick={toggleNav}
          >
            <span className="sr-only">Minimize navigation</span>
            <svg
              className="w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </section>
        <AdminNavItems navOpen={navOpen} />
        <section className="self-stretch p-4 bg-secondary-600 dark:bg-secondary-600">
          <div className="flex items-center cursor-pointer links-secondary">
            {/* Profile dropdown --> */}
            <OutsideClick toggle={setUserMenu} value={false}>
              <AvatarMenu
                userMenu={userMenu}
                setUserMenu={setUserMenu}
                positionClass="left-0 bottom-0 mb-6"
              />
            </OutsideClick>
            <OutsideClick toggle={setUserMenu} value={false}>
              <button className="ml-3" onClick={() => setUserMenu(true)}>
                <p className="text-sm font-medium text-basics-50 dark:text-basics-50">
                  {user?.displayName}
                </p>
                <p className="text-xs font-medium text-basics-200 dark:text-basics-200 group-hover:text-basics-200">
                  {user?.email}
                </p>
              </button>
            </OutsideClick>
          </div>
        </section>
      </section>
    );
  } else {
    return (
      <section className="relative grid w-16 h-full grid-cols-1 grid-rows-admin">
        <section className="flex items-center justify-between gap-4 pl-4 bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50">
          <AJLogoLeft />
          <button
            className="absolute inline-flex items-center justify-center p-2 text-xl rounded-md -right-12 text-basics-50 hover:text-basics-50 dark:text-basics-50 dark:hover:text-basics-50 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-basics-50"
            aria-expanded="false"
            onClick={toggleNav}
          >
            <span className="sr-only">Maximize navigation</span>
            <svg
              className="w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </section>
        <AdminNavItems navOpen={navOpen} />
        <section className="self-stretch p-4 bg-secondary-600 dark:bg-secondary-600">
          <a href="#" className="flex items-center links-secondary">
            <img
              className="inline-block w-8 h-8 rounded-full"
              src="/static/images/avatar.png"
              alt=""
            />
          </a>
        </section>
      </section>
    );
  }
}
