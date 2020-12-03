import Head from 'next/head';
import AJLogo from '@/components/global/icons/AJPrimary';
import TitleSloganLogo from '@/components/global/logos/TitleSloganLogo';
import TitleLogo from '@/components/global/logos/TitleLogo';

export default function Blog({ posts }) {
  return (
    <>
      <Head>
        <title>Design | CodingCatDev</title>
      </Head>

      <div className="grid flex-1 grid-flow-row grid-cols-1 gap-2 p-8 pt-8 lg:grid-cols-12">
        <div className="col-span-12">
          <div className="grid grid-cols-2 p-8 bg-gradient-to-r from-ccd-reds-600 to-ccd-purples-500">
            <h1 className="text-white">Components</h1>
            <h1 className="grid h-32 justify-items-end">
              <AJLogo className="block w-32 h-32" />
            </h1>
          </div>
        </div>

        {/* Logos */}
        <div className="col-span-12">
          <div className="flex flex-col justify-center h-32 p-8 bg-gradient-to-r from-ccd-reds-600 to-ccd-purples-500">
            <div className="text-4xl text-white">Logos</div>
          </div>
          <div className="flex flex-wrap ">
            <div>
              <TitleSloganLogo />
            </div>
            <div>
              <TitleLogo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
