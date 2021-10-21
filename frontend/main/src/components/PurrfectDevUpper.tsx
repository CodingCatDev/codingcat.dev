import Link from 'next/link';
import Image from 'next/image';
import AJHeadphones from '@/components/global/icons/AJHeadphones';

export default function PurrfectDevUpper(): JSX.Element {
  return (
    <>
      <section className="grid justify-center grid-cols-1 p-8 mx-auto 2xl:gap-10 lg:grid-cols-2 lg:px-10 2xl:min-h-768 max-w-7xl">
        <section className="grid items-center content-center grid-cols-1 gap-4 mx-auto 2xl:mx-0 2xl:justify-self-end">
          <h1 className="pt-4 -mb-4 text-5xl leading-snug tracking-tight vertical-text-clip xl:tracking-wide xl:text-6xl xl:leading-snug 2xl:text-7xl 2xl:leading-snug">
            Purrfect
            <br />
            Web Tutorials
          </h1>
          <p className="font-sans 2xl:text-2xl" style={{ maxWidth: `40ch` }}>
            A weekly podcast about web design and development from{' '}
            <Link href="/authors/HMCecxlYrmZv7nGqZQLwuER0dEt1">
              <a className="underline">Alex Patterson</a>
            </Link>{' '}
            and{' '}
            <Link href="/authors/58zC32FHcITm0ug72EUSr2dK5dC2">
              <a className="underline">Brittney Postma</a>
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/user/profile">
              <a className="btn-primary justify-self-start" role="button">
                Join CodingCat.dev
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
