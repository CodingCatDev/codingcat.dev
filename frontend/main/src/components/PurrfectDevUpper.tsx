import Link from 'next/link';
import AJHeadphones from '@/components/global/icons/AJHeadphones';
import { PopupButton } from 'react-calendly';

export default function PurrfectDevUpper(): JSX.Element {
  return (
    <>
      <section className="grid justify-center grid-cols-1 p-8 mx-auto 2xl:gap-10 lg:grid-cols-2 lg:px-10 2xl:min-h-768 max-w-7xl">
        <section className="grid items-center content-center grid-cols-1 gap-4 mx-auto 2xl:mx-0 2xl:justify-self-end">
          <h1 className="pt-4 -mb-4 text-5xl leading-snug tracking-tight vertical-text-clip xl:tracking-wide xl:text-6xl xl:leading-snug 2xl:text-7xl 2xl:leading-snug">
            Purrfect.dev
          </h1>
          <p className="font-sans 2xl:text-2xl" style={{ maxWidth: `40ch` }}>
            A weekly podcast about web design and development from{' '}
            <Link href="/authors/alex-patterson">
              <a className="underline">Alex Patterson</a>
            </Link>{' '}
            and{' '}
            <Link href="/authors/brittney-postma">
              <a className="underline">Brittney Postma</a>
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-4">
            <PopupButton
              url="https://calendly.com/d/cfv-5hs-ftb/podcast-recording"
              text="Join as Guest"
              className="btn-primary"
            />
            <Link href="/sponsorship">
              <a>
                <button className="flex items-center btn-secondary-reverse">
                  Ad Sponsorship
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </button>
              </a>
            </Link>
          </div>
        </section>
        <section className="grid grid-cols-1 row-start-1 -ml-10 lg:col-start-2 place-items-center 3xl:justify-items-start 3xl:ml-0">
          <AJHeadphones className="w-1/2 max-w-xs lg:w-3/4 lg:max-w-md" />
        </section>
      </section>
    </>
  );
}
