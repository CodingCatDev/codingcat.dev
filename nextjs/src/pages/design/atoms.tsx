import Head from 'next/head';
import AJLogo from '../../components/global/icons/AJPrimary';

export default function Blog({ posts }) {
  return (
    <>
      <Head>
        <title>Design | CodingCatDev</title>
      </Head>

      <div className="grid flex-1 grid-flow-row grid-cols-1 gap-2 p-8 pt-8 lg:grid-cols-12">
        <div className="col-span-12">
          <div className="grid grid-cols-2 p-8 bg-gradient-to-r from-ccd-reds-600 to-ccd-purples-500">
            <h1 className="text-white">Atoms</h1>
            <h1 className="grid h-32 justify-items-end">
              <AJLogo className="block w-32 h-32" />
            </h1>
          </div>
        </div>
        {/* Typography */}
        <div className="col-span-12">
          <div className="flex flex-col justify-center h-32 p-8 bg-gradient-to-r from-ccd-reds-600 to-ccd-purples-500">
            <div className="text-4xl text-white">Typography</div>
          </div>
          <div>
            <h4 className="font-sans bg-ccd-purples-200">Henny Penny</h4>
            <div>
              <h6>Henny Penny</h6>
              <h5>Henny Penny</h5>
              <h4>Henny Penny</h4>
              <h3>Henny Penny</h3>
              <h2>Henny Penny</h2>
              <h1>Henny Penny</h1>
            </div>
          </div>
          <div>
            <h4 className="font-sans bg-ccd-purples-200">Nunito</h4>
            <div>
              <p className="text-xs">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-sm">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-base">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-lg">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-xl">
                The quick brown fox jumps over the lazy dog.
              </p>
              <p className="text-2xl">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="col-span-12">
          <div className="flex flex-col justify-center h-32 p-8 bg-gradient-to-r from-ccd-reds-600 to-ccd-purples-500">
            <div className="text-4xl text-white">Spacing</div>
          </div>
          <div>
            <div>
              <p>h-1</p>
              <div className="h-1 bg-ccd-purples-500"></div>
              <p>h-2</p>
              <div className="h-2 bg-ccd-purples-500"></div>
              <p>h-3</p>
              <div className="h-3 bg-ccd-purples-500"></div>
              <p>h-4</p>
              <div className="h-4 bg-ccd-purples-500"></div>
              <p>h-5</p>
              <div className="h-5 bg-ccd-purples-500"></div>
              <p>h-6</p>
              <div className="h-6 bg-ccd-purples-500"></div>
              <p>h-8</p>
              <div className="h-8 bg-ccd-purples-500"></div>
              <p>h-10</p>
              <div className="h-10 bg-ccd-purples-500"></div>
              <p>h-12</p>
              <div className="h-12 bg-ccd-purples-500"></div>
              <p>h-16</p>
              <div className="h-16 bg-ccd-purples-500"></div>
              <p>h-20</p>
              <div className="h-20 bg-ccd-purples-500"></div>
              <p>h-24</p>
              <div className="h-24 bg-ccd-purples-500"></div>
              <p>h-32</p>
              <div className="h-32 bg-ccd-purples-500"></div>
              <p>h-40</p>
              <div className="h-40 bg-ccd-purples-500"></div>
              <p>h-48</p>
              <div className="h-48 bg-ccd-purples-500"></div>
              <p>h-56</p>
              <div className="h-56 bg-ccd-purples-500"></div>
              <p>h-64</p>
              <div className="h-64 bg-ccd-purples-500"></div>
            </div>
          </div>
          <div>
            <h2 className="font-sans">Nunito</h2>
            <div>
              <p className="text-xs">
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
