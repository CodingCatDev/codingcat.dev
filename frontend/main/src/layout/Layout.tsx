import {
  useState,
  useEffect,
  ComponentType,
  Dispatch,
  SetStateAction,
} from 'react';
import router from 'next/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import nightwind from 'nightwind/helper';

import { AppTopbar } from './AppTopbar';

import AppMenu from '@/layout/AppMenu';
import { Site } from '@/models/site.model';

// const Footer = dynamic(
//   () => import('@/layout/Footer').then((mod: any) => mod.Footer),
//   {
//     ssr: false,
//     loading: () => <p>Adding the Menu...</p>,
//   }
// );

import Footer from '@/layout/Footer';

const Layout = ({
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
    <div className="flex flex-col h-screen overflow-hidden bg-primary-900 dark:bg-primary-900 md:w-4/5 md:mx-auto">
      <Head>
        <script dangerouslySetInnerHTML={{ __html: nightwind.init() }} />
      </Head>
      <AppTopbar
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
      />
      <div className="overflow-x-hidden overflow-y-auto scrollbar calc-height-wrapper">
        <main className="grid justify-center grid-cols-1 gap-10 bg-primary-50 dark:bg-basics-700">
          {children}
        </main>

        <Footer site={site} />
      </div>
      <AppMenu
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
      />
      {/* <style jsx>
        {`
          .calc-height-wrapper {
            min-height: calc(100vh - 5rem);
          }

          .calc-height {
            min-height: calc(100vh - 6.5rem);
          }
        `}
      </style> */}
    </div>
  );
};

export default Layout;
