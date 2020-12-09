import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import router from 'next/router';

import { AppMenu } from './AppMenu';
import { AppTopbar } from './AppTopbar';
import { Footer } from './Footer';

import OutsideClick from '@/components/OutsideClick';

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
      <div className="overflow-y-auto overflow-x-hidden calc-height-wrapper">
        <main className="flex justify-center calc-height bg-ccd-purples-050">
          {children}
        </main>

        <Footer />
      </div>
      <Transition
        show={overlayMenuActive}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-75"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 overflow-hidden bg-ccd-purples-100 bg-opacity-70">
          <div className="absolute inset-0 overflow-hidden">
            <OutsideClick toggle={setOverlayMenuActive} value={false}>
              <section
                className="absolute inset-y-0 right-0 flex max-w-full"
                aria-labelledby="slide-over-heading"
              >
                <div className="w-screen max-w-md">
                  <div className="flex flex-col h-full shadow-xl bg-ccd-basics-800">
                    <AppMenu
                      onMenuItemClick={onMenuItemClick}
                      setOverlayMenuActive={setOverlayMenuActive}
                      overlayMenuActive={overlayMenuActive}
                    />
                  </div>
                </div>
              </section>
            </OutsideClick>
          </div>
        </div>
      </Transition>
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
