import { Dispatch, SetStateAction } from 'react';
import AJLogoLeft from '@/components/global/icons/AJAlt';
import AdminNavItems from '@/layout/admin/AdminNavItems';
import OutsideClick from '@/components/OutsideClick';
import AvatarMenu from '@/components/user/AvatarMenu';
import { useUser } from '@/utils/auth/useUser';

export default function AdminMenu({
  navOpen,
  setNavOpen,
  userMenu,
  setUserMenu,
}: {
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
  userMenu: boolean;
  setUserMenu: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  const { user } = useUser();

  return (
    <section className="relative z-40 grid h-full grid-cols-1 grid-rows-admin">
      <section className="flex items-center justify-between gap-4 pl-4 bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50">
        <AJLogoLeft />
        {navOpen && (
          <h2 className="hidden mr-4 text-2xl lg:block">CodingCat.dev</h2>
        )}
      </section>
      <AdminNavItems navOpen={navOpen} setNavOpen={setNavOpen} />
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
          {navOpen && (
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
          )}
        </div>
      </section>
    </section>
  );
}
