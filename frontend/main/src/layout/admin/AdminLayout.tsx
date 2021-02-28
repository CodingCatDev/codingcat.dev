import { useState, useEffect } from 'react';
import router from 'next/router';
import Head from 'next/head';
import nightwind from 'nightwind/helper';

import AdminMenu from '@/layout/admin/AdminMenu';
import { Site } from '@/models/site.model';
import { AdminHeader } from '@/layout/admin/AdminHeader';
import { Post } from '@/models/post.model';

const AdminLayout = ({
  site,
  post,
  children,
}: {
  site: Site | null;
  post?: Post;
  children: any;
}): JSX.Element => {
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [navOpen, setNavOpen] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [overlayMenuActive]);

  router.events.on('routeChangeComplete', () => setOverlayMenuActive(false));

  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
      </Head>
      <div className="lg:mx-auto lg:w-80 lg:max-w-8xl">
        <div className="grid h-screen grid-cols-admin">
          <AdminMenu
            userMenu={userMenu}
            setUserMenu={setUserMenu}
            navOpen={navOpen}
            setNavOpen={setNavOpen}
          />

          <div className="grid items-start h-full grid-cols-1 grid-rows-admin">
            <AdminHeader
              site={site}
              post={post}
              userMenu={userMenu}
              setUserMenu={setUserMenu}
              navOpen={navOpen}
              setNavOpen={setNavOpen}
            />
            <main className="h-full text-primary-900 bg-primary-50 dark:bg-basics-900">
              {children}
            </main>
            <footer className="flex items-center justify-center h-full text-basics-50 dark:text-basics-50">
              &copy; CodingCatDev {new Date().getFullYear()}
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
