import { useState, useEffect } from 'react';
import router from 'next/router';
// import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';

import { AppTopbar } from '@/layout/AppTopbar';

import AppMenu from '@/layout/AppMenu';
import useIsNavigating from '@/hooks/useIsNavigating';
import { Progress } from '@/components/global/loading/Progress';
import dynamic from 'next/dynamic';
const CodingCatBuilder = dynamic(
  () =>
    import('@/components/builder/CodingCatBuilder').then((res) => res as any),
  { ssr: false }
) as any;
const FirebaseProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseProvider
    ),
  {
    ssr: false,
  }
);

const FirebasePerformanceProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebasePerformanceProvider
    ),
  {
    ssr: false,
  }
);

const FirebaseAnalyticsProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseAnalyticsProvider
    ),
  {
    ssr: false,
  }
);

const FirebaseAuthProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseAuthProvider
    ),
  {
    ssr: false,
  }
);

const FirebaseFirestoreProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseFirestoreProvider
    ),
  {
    ssr: false,
  }
);

const FirebaseFunctionsProvider = dynamic<any>(
  () =>
    import('@/components/firebase/wrappers').then(
      (mod) => mod.FirebaseFunctionsProvider
    ),
  {
    ssr: false,
  }
);

const Layout = ({
  header,
  footer,
  children,
}: {
  header: any;
  footer: any;
  children?: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const isNavigating = useIsNavigating();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [overlayMenuActive]);

  router.events.on('routeChangeComplete', () => setOverlayMenuActive(false));

  return (
    <>
      <FirebaseProvider>
        <FirebasePerformanceProvider>
          <FirebaseAnalyticsProvider>
            <FirebaseAuthProvider>
              <FirebaseFirestoreProvider>
                <FirebaseFunctionsProvider>
                  <ThemeProvider
                    attribute="class"
                    storageKey="nightwind-mode"
                    defaultTheme="light"
                  >
                    <Progress isAnimating={isNavigating} />
                    <AppTopbar
                      setOverlayMenuActive={setOverlayMenuActive}
                      overlayMenuActive={overlayMenuActive}
                      header={header}
                    />
                    <div className="grid grid-cols-1 justify-items-center calc-height-wrapper lg:mx-auto lg:w-80 lg:max-w-8xl lg:justify-items-stretch">
                      <main className="grid justify-center w-full grid-cols-1 gap-10 bg-primary-50 dark:bg-basics-700">
                        <>{children}</>
                      </main>
                      <CodingCatBuilder model="footer" content={footer} />
                    </div>
                    <AppMenu
                      setOverlayMenuActive={setOverlayMenuActive}
                      overlayMenuActive={overlayMenuActive}
                      userMenu={userMenu}
                      setUserMenu={setUserMenu}
                    />
                  </ThemeProvider>
                </FirebaseFunctionsProvider>
              </FirebaseFirestoreProvider>
            </FirebaseAuthProvider>
          </FirebaseAnalyticsProvider>
        </FirebasePerformanceProvider>
      </FirebaseProvider>
    </>
  );
};

export default Layout;
