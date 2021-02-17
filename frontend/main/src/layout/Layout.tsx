import { useState, useEffect } from 'react';
import router from 'next/router';
// import dynamic from 'next/dynamic';
import Head from 'next/head';
import nightwind from 'nightwind/helper';

import { AppTopbar } from '@/layout/AppTopbar';

import AppMenu from '@/layout/AppMenu';
import { Site } from '@/models/site.model';
import Footer from '@/layout/Footer';

const Layout = ({
  site,
  children,
}: {
  site: Site | null;
  children: any;
}): JSX.Element => {
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);

  // let menuClick = false;

  // const onSidebarClick = () => {
  //   menuClick = true;
  // };

  // const onShowMenuButton = (event: any) => {
  //   console.log(event);
  // };

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
      <div className="grid grid-cols-1 overflow-x-hidden overflow-y-auto justify-items-center calc-height-wrapper lg:mx-auto lg:w-80 lg:max-w-8xl lg:justify-items-stretch">
        <main className="grid justify-center grid-cols-1 gap-10 bg-primary-50 dark:bg-basics-700">
          {children}
        </main>

        <Footer site={site} />
      </div>
      <AppMenu
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
      />
    </>
  );
};

export default Layout;
