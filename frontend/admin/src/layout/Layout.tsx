import {
  useState,
  useEffect,
  ComponentType,
  Dispatch,
  SetStateAction,
} from 'react';
import router from 'next/router';
import dynamic from 'next/dynamic';
import AdminMenu from '@/layout/AdminMenu';

const AppMenu: ComponentType<{
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
}> = dynamic(() => import('@/layout/AppMenu').then((mod: any) => mod.AppMenu), {
  ssr: false,
  loading: () => <p>Adding the Menu...</p>,
});

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
    <div className="flex flex-row h-screen overflow-hidden bg-purple-900">
      <div className="w-1/12">
        <AdminMenu />
      </div>
      <div className="w-11/12 overflow-x-hidden overflow-y-auto scrollbar calc-height-wrapper">
        <main className="grid justify-center h-full grid-cols-1 gap-10 calc-height bg-purple-050">
          {children}
        </main>
      </div>
      <AppMenu
        setOverlayMenuActive={setOverlayMenuActive}
        overlayMenuActive={overlayMenuActive}
      />
    </div>
  );
};

export default Layout;
