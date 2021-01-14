import Head from 'next/head';
import Layout from '@/layout/Layout';
import CopyButton from '@/components/common/CopyButton';

export default function VideoCall() {
  return (
    <>
      <div className="grid w-full grid-rows-1 gap-4 p-2 sm:grid-rows-6">
        <div className="w-full row-span-1 px-4 pt-5 pb-4 rounded-md justify-self-center max-w-screen-2xl bg-gradient-to-r from-purple-500 via-ccd-reds-400 to-ccd-pinks-400 sm:p-6 sm:pb-4">
          <div className="grid w-full h-full grid-cols-1 gap-8 sm:grid-cols-2 justify-items-stretch place-content-center place-items-center">
            <div className="flex items-center content-center justify-center">
              <p className="text-3xl text-white justify-self-center">
                Here is the join link for your chat
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="hidden w-12 h-12 text-white md:block"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </div>
            <div className="flex flex-wrap items-center content-center justify-center">
              <p className="pr-2 text-xl text-white">
                {window ? window.location.href : ''}
              </p>
              <button className="btn-primary justify-self-start">
                <CopyButton
                  code={window ? window.location.href : ''}
                ></CopyButton>
              </button>
            </div>
          </div>
        </div>
        <div className="row-span-1 sm:row-span-5 justify-items-stretch">
          <div className="grid grid-cols-1 ">
            <div className="w-full h-full px-2 pt-5 pb-4 rounded-md justify-self-center max-w-screen-2xl bg-gradient-to-r from-purple-500 via-ccd-reds-400 to-ccd-pinks-400">
              <div
                id="videos"
                className="grid w-full h-full grid-cols-1 gap-2 place-content-center place-items-end"
              >
                <video
                  id="localVideo"
                  muted
                  autoPlay
                  playsInline
                  className="w-full bg-black rounded-md"
                ></video>
                <video
                  id="remoteVideo"
                  autoPlay
                  playsInline
                  className="w-3/12 bg-purple-900 rounded-md"
                ></video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
