import NextLink from 'next/link';

export default function PostMediaLocked(): JSX.Element {
  return (
    <>
      <div className="relative">
        <div className="flex flex-col items-center justify-center bricks-pattern">
          <section className="grid grid-cols-1 p-4 m-4 text-center rounded-lg bg-primary-50 dark:bg-primary-700">
            <div className="max-w-xl mx-auto">
              <p className="flex justify-center font-sans text-4xl font-semibold lg:text-5xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className=" w-60"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </p>
              <p className="font-sans text-4xl font-semibold lg:text-5xl ">
                Become a{' '}
                <span className="text-secondary-600 dark:text-secondary-600">
                  Purrfect Peep
                </span>{' '}
                and join CodingCat.dev
              </p>
              <p className="mt-4 font-sans text-lg lg:text-3xl text-basics-600">
                Get access to all of the exclusive content and up your coding
                skills.
              </p>
              <div className="flex items-end justify-center w-full py-5">
                <div className="flex items-center">
                  <div className="flex items-end leading-none">
                    <span className="self-start mt-1">USD</span>
                    <span className="text-4xl font-light">$</span>
                    <span className="self-stretch text-4xl font-extrabold">
                      <div className="relative ">5.00</div>
                    </span>
                  </div>
                </div>
                <span className="pl-1 sm:text-lg">/ month</span>
              </div>
            </div>
            <NextLink href="/user/profile">
              <a className="btn-primary">Become Member</a>
            </NextLink>
            <div className="flex justify-center">
              <NextLink href="/pricing">
                <a className="flex items-center py-1 mt-4 text-xs transition-all duration-200 ease-in-out group opacity-80 hover:opacity-100">
                  Pay yearly or monthly{' '}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    xmlSpace="preserve"
                    className="w-6 fill-current"
                  >
                    <path
                      xmlns="http://www.w3.org/2000/svg"
                      d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76z"
                    />
                  </svg>
                </a>
              </NextLink>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
