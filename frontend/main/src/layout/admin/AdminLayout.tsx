import { useState, useEffect } from 'react';
import router from 'next/router';
import Head from 'next/head';
import nightwind from 'nightwind/helper';
import { ThemeProvider } from 'next-themes';

import AdminMenu from '@/layout/admin/AdminMenu';
import { Site } from '@/models/site.model';
import { AdminHeader } from '@/layout/admin/AdminHeader';
import { Post } from '@/models/post.model';

import useIsNavigating from '@/hooks/useIsNavigating';
import { Progress } from '@/components/global/loading/Progress';

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
  const isNavigating = useIsNavigating();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [overlayMenuActive]);

  router.events.on('routeChangeComplete', () => setOverlayMenuActive(false));

  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
      </Head>
      <ThemeProvider
        attribute="class"
        storageKey="nightwind-mode"
        defaultTheme="light"
      >
        <div className="lg:mx-auto lg:w-full lg:max-w-8xl">
          <Progress isAnimating={isNavigating} />
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
              <main className="grid h-full text-primary-900 bg-primary-50 dark:bg-basics-900">
                {children}
                <footer className="flex items-start self-end justify-center p-4">
                  &copy; CodingCatDev {new Date().getFullYear()}
                </footer>
              </main>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </>
  );
};

export default AdminLayout;
