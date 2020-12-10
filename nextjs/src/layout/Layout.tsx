import {
  useState,
  useEffect,
  ComponentType,
  Dispatch,
  SetStateAction,
} from 'react';
import router from 'next/router';
import dynamic from 'next/dynamic';

import { AppTopbar } from './AppTopbar';

const AppMenu: ComponentType<{
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
}> = dynamic(() => import('@/layout/AppMenu').then((mod: any) => mod.AppMenu), {
  ssr: false,
  loading: () => <p>Adding the Menu...</p>,
});

const Footer = dynamic(
  () => import('@/layout/Footer').then((mod: any) => mod.Footer),
  {
    ssr: false,
    loading: () => <p>Adding the Menu...</p>,
  }
);

const Layout = ({ children }: { children: any }) => {
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
    <div className="flex flex-col h-screen overflow-hidden bg-ccd-purples-900 md:w-4/5 md:mx-auto">
      <AppTopbar
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
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
