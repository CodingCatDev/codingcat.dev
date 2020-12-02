import '../styles/globals.css';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import router from 'next/router';

import { AppTopbar } from '../layout/AppTopbar';
import { AppMenu } from '../layout/AppMenu';

import OutsideClick from '@/components/OutsideClick';

function MyApp({ Component, pageProps }) {
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

  router.events.on('routeChangeComplete', () => setOverlayMenuActive(false));

  return (
    <>
      <div className="flex h-screen">
        <div className="flex flex-col flex-1 overflow-hidden">
          <header>
            <AppTopbar
              setOverlayMenuActive={setOverlayMenuActive}
              overlayMenuActive={overlayMenuActive}
              onMenuItemClick={onMenuItemClick}
            />
          </header>
          <main className="flex flex-1 overflow-x-hidden overflow-y-auto bg-ccd-purples-050">
            <Component {...pageProps} />
          </main>
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
        </div>
      </div>
    </>
  );
}

export default MyApp;
