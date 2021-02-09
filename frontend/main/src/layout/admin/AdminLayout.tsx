import { useState, useEffect } from 'react';
import router from 'next/router';
import Head from 'next/head';
import nightwind from 'nightwind/helper';

import AppMenu from '@/layout/AppMenu';
import { Site } from '@/models/site.model';
import Footer from '@/layout/Footer';
import AdminNavItems from '@/layout/admin/AdminNavItems';
import { AppTopbar } from '@/layout/AppTopbar';

const AdminLayout = ({
  site,
  children,
}: {
  site: Site | null;
  children: any;
}): JSX.Element => {
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);

  let menuClick = false;

  const onSidebarClick = () => {
    menuClick = true;
  };

  const onShowMenuButton = (event: any) => {
    console.log(event);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [overlayMenuActive]);

  router.events.on('routeChangeComplete', () => setOverlayMenuActive(false));

  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
      </Head>
      <AppTopbar
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
      />
      <div className="grid grid-cols-1 overflow-x-hidden overflow-y-auto justify-items-center scrollbar calc-height-wrapper lg:mx-auto lg:w-80 lg:max-w-8xl lg:justify-items-stretch">
        <main className="grid justify-center grid-cols-1 gap-10 bg-primary-50 dark:bg-basics-700">
          <div className="flex">
            <AdminNavItems />
            {children}
          </div>
        </main>
        <Footer site={site} hideWave={true} />
      </div>
      <AppMenu
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
      />
    </>
  );
};

export default AdminLayout;
