import '../styles/globals.css';
import { useState } from 'react';
import { Transition } from '@tailwindui/react';

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
  return (
    <>
      <div className="flex h-screen bg-gray-200">
        <div className="flex-1 flex flex-col overflow-hidden">
          <header>
            <AppTopbar
              setOverlayMenuActive={setOverlayMenuActive}
              overlayMenuActive={overlayMenuActive}
              onMenuItemClick={onMenuItemClick}
            />
          </header>
          <main className="flex flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            <Component {...pageProps} />
          </main>
          <Transition
            show={overlayMenuActive}
            enter="transform transition ease-in-out"
            enterFrom="translate-x-8"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out"
            leaveFrom="translate-x-8"
            leaveTo="translate-x-0"
          >
            <div className="fixed inset-0 overflow-hidden bg-ccd-primary-100 bg-opacity-70">
              <div className="absolute inset-0 overflow-hidden">
                <OutsideClick toggle={setOverlayMenuActive} value={false}>
                  <section
                    className="absolute inset-y-0 left-0 max-w-full flex"
                    aria-labelledby="slide-over-heading"
                  >
                    <div className="w-screen max-w-md">
                      <div className="h-full flex flex-col shadow-xl  bg-gray-800">
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
