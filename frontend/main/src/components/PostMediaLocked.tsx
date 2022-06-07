import NextLink from 'next/link';

const LockSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
      clipRule="evenodd"
    />
  </svg>
);

export default function PostMediaLocked(): JSX.Element {
  return (
    <>
      <div
        style={{
          overflow: 'hidden',
          paddingTop: '56.25%',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center bricks-pattern">
          <section className="grid grid-cols-1 gap-10 p-4 text-center rounded-lg bg-primary-50 dark:bg-primary-700">
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
            </div>
            <NextLink href="/user/profile">
              <a className="btn-primary">Become Member</a>
            </NextLink>
          </section>
        </div>
      </div>
    </>
  );
}
