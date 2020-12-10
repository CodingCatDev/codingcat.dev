import { useState, useEffect } from 'react';
import router from 'next/router';
import dynamic from 'next/dynamic';

import { AppTopbar } from './AppTopbar';

const AppMenu = dynamic(
  () => import('@/layout/AppMenu').then((mod) => mod.AppMenu),
  {
    ssr: false,
    loading: () => <p>Adding the Menu...</p>,
  }
);

const Footer = dynamic(
  () => import('@/layout/Footer').then((mod) => mod.Footer),
  {
    ssr: false,
    loading: () => <p>Adding the Menu...</p>,
  }
);

const Layout = ({ children }) => {
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);

  let menuClick = false;

  const onSidebarClick = () => {
    menuClick = true;
  };
  const onMenuItemClick = (event) => {
    if (!event.item.items) {
      setOverlayMenuActive(false);
    }
  };
  const onShowMenuButton = (event) => {
    console.log(event);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [overlayMenuActive]);

  router.events.on('routeChangeComplete', () => setOverlayMenuActive(false));

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-ccd-purples-900 md:w-4/5 md:mx-auto">
      <AppTopbar
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
        onMenuItemClick={onMenuItemClick}
      />
      <div className="overflow-x-hidden overflow-y-auto calc-height-wrapper">
        <main className="flex justify-center calc-height bg-ccd-purples-050">
          {children}
        </main>

        <Footer />
      </div>
      <AppMenu
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
      />
      <style jsx>
        {`
          .calc-height-wrapper {
            min-height: calc(100vh - 5rem);
          }

          .calc-height {
            min-height: calc(100vh - 6.5rem);
          }
        `}
      </style>
    </div>
  );
};

export default Layout;
