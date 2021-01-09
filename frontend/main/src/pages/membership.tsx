import Head from 'next/head';
import dynamic from 'next/dynamic';

import Layout from '@/layout/Layout';
import { useUser } from '@/utils/auth/useUser';
import MembershipCards from '@/components/MembershipCards';
import { getActiveProducts } from '@/services/serversideApi';
import { StripeProduct } from '@/models/stripe.model';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

export default function Membership({
  products,
}: {
  products: StripeProduct[];
}): JSX.Element {
  const { user, signout } = useUser();

  return (
    <Layout>
      <Head>
        <title>Profile | CodingCatDev</title>
      </Head>
      <div>
        <div className="flex flex-wrap content-center w-full">
          <div className="max-w-6xl px-8 mx-auto my-12 antialiased rounded">
            <div className="relative items-center block md:flex">
              <div className="relative w-full overflow-hidden rounded shadow-lg md:w-1/2 z-1 bg-primary-100">
                <div className="flex flex-wrap w-full">
                  <div className="w-full py-4 text-center bg-primary-900 lg:px-4">
                    <div
                      className="flex items-center p-2 leading-none text-white text-indigo-100 lg:rounded-full lg:inline-flex"
                      role="alert"
                    >
                      <span className="flex px-2 py-1 mr-3 text-xs font-bold uppercase rounded-full bg-secondary-400">
                        Pro Features
                      </span>
                      <span className="flex-auto mr-2 font-semibold text-left">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                  <div className="w-full p-8 text-2xl font-bold tracking-wide text-center uppercase border-b text-primary-900 border-primary-900">
                    Why Go Pro?
                  </div>
                </div>
                <div className="flex justify-center m-3">
                  <ul>
                    <li className="flex items-center">
                      <div className="p-3 rounded-full fill-current bg-primary-200 text-primary-900">
                        <svg
                          className="w-8 h-8"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0zm16.32-4.9L5.09 16.31A8 8 0 0 0 16.32 5.09zm-1.41-1.42A8 8 0 0 0 3.68 14.91L14.91 3.68z" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-wrap">
                        <span className="ml-3 text-xl font-bold text-primary-900">
                          Ad Free Experience
                        </span>
                        <span className="max-w-sm ml-3 text-primary-900 text-md">
                          Enjoy CodingCat.dev Tutorial website 100% without ads.
                        </span>
                        <span className="max-w-sm ml-3 text-primary-900 text-md">
                          No referral links and no advertisements.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center mt-3">
                      <div className="p-3 rounded-full fill-current bg-primary-200 text-primary-900">
                        <svg
                          className="w-8 h-8"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 8V6a6 6 0 1 1 12 0h-3v2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-wrap">
                        <span className="ml-3 text-xl font-bold text-primary-900">
                          Full Access
                        </span>
                        <span className="max-w-sm ml-3 text-primary-900 text-md">
                          Access the full CodingCat.dev Tutorial catalog and
                          enjoy new premium tutorial series every single month.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center mt-3">
                      <div className="p-3 rounded-full fill-current bg-primary-200 text-primary-900">
                        <svg
                          className="w-8 h-8"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M0 2C0 .9.9 0 2 0h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm14 12h4V2H2v12h4c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2zM9 8V5h2v3h3l-4 4-4-4h3z" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-wrap">
                        <span className="ml-3 text-xl font-bold text-primary-900">
                          Free Series Video Download
                        </span>
                        <span className="max-w-sm ml-3 text-primary-900 text-md">
                          Full zip file of entire pro series.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center mt-3">
                      <div className="p-3 rounded-full fill-current bg-primary-200 text-primary-900">
                        <svg
                          className="w-8 h-8"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M11 0h1v3l3 7v8a2 2 0 0 1-2 2H5c-1.1 0-2.31-.84-2.7-1.88L0 12v-2a2 2 0 0 1 2-2h7V2a2 2 0 0 1 2-2zm6 10h3v10h-3V10z" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-wrap">
                        <span className="ml-3 text-xl font-bold text-primary-900">
                          Like and Bookmark
                        </span>
                        <span className="max-w-sm ml-3 text-primary-900 text-md">
                          Allows for better feedback, and you can see what
                          courses work better for you!
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center mt-3">
                      <div className="p-3 rounded-full fill-current bg-primary-200 text-primary-900">
                        <svg
                          className="w-8 h-8"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6 4H5a1 1 0 1 1 0-2h11V1a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V5a1 1 0 0 0-1-1h-7v8l-2-2-2 2V4z" />
                        </svg>
                      </div>
                      <div className="flex flex-col flex-wrap">
                        <span className="ml-3 text-xl font-bold text-primary-900">
                          Track Progress
                        </span>
                        <span className="max-w-sm ml-3 text-primary-900 text-md">
                          Some of the courses are very detailed, tracking allows
                          you to remember where you left off.
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center p-6 mt-6 font-semibold text-white uppercase bg-primary-900 text-md">
                  <span>Create account</span>
                  <span className="ml-2 font-medium text-white">➔</span>
                </div>
              </div>

              {/* Valid User */}
              {user && user.uid ? (
                <div
                  className={`${
                    user.memberships ? 'w-full' : 'md:w-1/2'
                  } "w-full relative z-0 px-8 md:px-0 md:py-16"`}
                >
                  <div
                    className={`${
                      user.memberships
                        ? 'rounded'
                        : 'rounded-b md:rounded-b-none md:rounded-r'
                    } flex flex-wrap bg-white max-w-lg shadow-lg overflow-hidden mx-auto`}
                  >
                    {user.photoURL && (
                      <img
                        src={user.photoURL}
                        alt={`${user.displayName} Photo`}
                        className="w-32 h-32 m-4"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap justify-end w-full pt-2 pr-2">
                        <button
                          type="button"
                          onClick={() => signout()}
                          className="items-center justify-center px-4 py-2 text-white rounded bg-secondary-500 hover:opacity-75"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                    {user && !user.memberships && (
                      <div className="p-8 text-xl text-primary-800">
                        <p className="p-2">
                          Welcome {user.displayName}! You are now signed in.
                        </p>
                        <p className="p-2">
                          In order to use{' '}
                          <span className="font-black">ALL</span> the{' '}
                          <span className="font-bold text-secondary-500">
                            Membership
                          </span>{' '}
                          features you must select an option for membership
                          below.
                        </p>
                      </div>
                    )}
                    {user && user.memberships && (
                      <p className="p-8 text-xl text-primary-800">
                        Welcome Back{' '}
                        <span className="font-bold">{user.displayName}</span>!
                        You can see all of your information in the selections
                        below, just click the button and a detailed table data
                        will appear.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative z-0 w-full px-8 md:w-1/2 md:px-0 md:py-16">
                  <div className="overflow-hidden text-white rounded-b shadow-lg bg-primary-800 md:rounded-b-none md:rounded-r">
                    <div className="p-4 text-xl font-bold tracking-wide text-center text-white uppercase border-b border-primary-200">
                      Sign In
                    </div>

                    <FirebaseAuth />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <MembershipCards products={products} />
      </div>
    </Layout>
  );
}

export async function getStaticProps(): Promise<{
  props: {
    products: StripeProduct[];
  };
  revalidate: number;
}> {
  const products = await getActiveProducts();
  return {
    props: {
      products,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  };
}
