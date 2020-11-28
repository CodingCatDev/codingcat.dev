import '../styles/globals.css';
import { useState } from 'react';
import { Transition } from '@tailwindui/react';

import { AppTopbar } from '../layout/AppTopbar';
import { AppMenu } from '../layout/AppMenu';

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
      <div className="fixed w-full z-50">
        <AppTopbar
          setOverlayMenuActive={setOverlayMenuActive}
          overlayMenuActive={overlayMenuActive}
          onMenuItemClick={onMenuItemClick}
        />
      </div>
      <div className="h-screen">
        <Component {...pageProps} />
        <Transition
          show={overlayMenuActive}
          enter="transform transition ease-in-out"
          enterFrom="translate-x-8"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out"
          leaveFrom="translate-x-8"
          leaveTo="translate-x-0"
        >
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <section
                className="absolute inset-y-0 left-0 max-w-full flex"
                aria-labelledby="slide-over-heading"
              >
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col shadow-xl pt-16 bg-gray-800">
                    <AppMenu onMenuItemClick={onMenuItemClick} />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </Transition>
      </div>
    </>
  );
}

export default MyApp;
