import { useState, useEffect } from 'react';
import router from 'next/router';
// import dynamic from 'next/dynamic';
import { ThemeProvider } from 'next-themes';

import { AppTopbar } from '@/layout/AppTopbar';

import AppMenu from '@/layout/AppMenu';
import useIsNavigating from '@/hooks/useIsNavigating';
import { Progress } from '@/components/global/loading/Progress';
import dynamic from 'next/dynamic';
import { BuilderComponent } from '@builder.io/react';
import { useAuth, useUser } from 'reactfire';
import useIsMember from '@/hooks/useIsMember';
import { UserInfoExtended } from '@/models/user.model';
import { ModelType } from '@/models/builder.model';
import PostMediaLocked from '@/components/PostMediaLocked';

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
  modelData,
  model,
  recentPosts,
  list,
}: {
  header: any;
  footer: any;
  modelData: any;
  model: ModelType;
  recentPosts: any;
  list: any;
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
                        {model == ModelType.lesson ? (
                          <UserWrapper
                            modelData={modelData}
                            model={model}
                            recentPosts={recentPosts}
                            list={list}
                          />
                        ) : (
                          <BuilderComponent
                            options={{ includeRefs: true }}
                            model={model}
                            content={modelData}
                            data={{ recentPosts, modelData, list }}
                          />
                        )}
                      </main>
                      <BuilderComponent model="footer" content={footer} />
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

const UserWrapper = ({
  modelData,
  model,
  recentPosts,
  list,
}: {
  modelData: any;
  model: string;
  recentPosts: any;
  list: any;
}) => {
  const { data: user } = useUser();
  if (user)
    return (
      <MemberWrapper
        user={user}
        modelData={modelData}
        model={model}
        recentPosts={recentPosts}
        list={list}
      />
    );
  else return <PostMediaLocked />;
};

const MemberWrapper = ({
  user,
  modelData,
  model,
  recentPosts,
  list,
}: {
  user: UserInfoExtended;
  modelData: any;
  model: string;
  recentPosts: any;
  list: any;
}) => {
  const { member, team } = useIsMember(user);

  if (member || team) {
    return (
      <BuilderComponent
        options={{ includeRefs: true }}
        model={model}
        content={modelData}
        data={{ recentPosts, modelData, list, user, team, member }}
      />
    );
  } else {
    return <PostMediaLocked />;
  }
};
