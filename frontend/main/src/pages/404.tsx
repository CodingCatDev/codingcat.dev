import { NextSeo } from 'next-seo';
import Link from 'next/link';
import AJ404 from '@/components/global/icons/AJ404';

import { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import builder, { BuilderComponent } from '@builder.io/react';
import { Progress } from '@/components/global/loading/Progress';
import AppMenu from '@/layout/AppMenu';
import { AppTopbar } from '@/layout/AppTopbar';
import { ThemeProvider } from 'next-themes';
import useIsNavigating from '@/hooks/useIsNavigating';
import router from 'next/router';
import { useState, useEffect } from 'react';

export async function getStaticProps({
  params,
}: GetStaticPropsContext<{ page: string[] }>) {
  console.log(JSON.stringify(params));
  const [header, footer] = await Promise.all([
    builder.get('header').promise(),
    builder.get('footer').promise(),
  ]);

  return {
    props: {
      header: header || null,
      footer: footer || null,
    },
    revalidate: 5,
  };
}

export default function Custom404({
  header,
  footer,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const isNavigating = useIsNavigating();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [overlayMenuActive]);

  router.events.on('routeChangeComplete', () => setOverlayMenuActive(false));
  return (
    <>
      <NextSeo title="404 | Not Found" noindex={true}></NextSeo>

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
            <section className="grid content-start grid-cols-1 gap-10 p-4 text-center justify-items-center">
              <AJ404 />
              <h1 className="text-5xl lg:text-6xl">
                Uh oh, that page doesn&apos;t seem to exist.
              </h1>
              <h2 className="font-sans text-4xl lg:text-5xl">
                Were you looking for{' '}
                {/* add some logic here to say which route they clicked? */}
                <Link href="/courses">
                  <a className="underline text-secondary-600">Courses</a>
                </Link>
              </h2>
            </section>
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
    </>
  );
}
