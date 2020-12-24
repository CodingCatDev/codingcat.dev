import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/layout/Layout';
import { useState } from 'react';
import AJAlt from '@/components/global/icons/AJAlt';
import KCAlt from '@/components/global/icons/KCAlt';

export default function Video() {
  const [callName, setCallName] = useState('CodingCatChat');

  return (
    <Layout>
      <Head>
        <title>Video | CodingCatDev</title>
      </Head>
      <div className="grid grid-cols-1 gap-8 p-2 mx-auto max-w-7xl place-content-start">
        <h3 className="pt-8" id="modal-headline">
          CodingCatChat
        </h3>
        {/* <div className="px-4 pt-5 pb-4 bg-gradient-to-r from-purple-500 via-red-400 to-pink-400 sm:p-6 sm:pb-4 h-80 rounded-xl">
          <div className="grid h-full grid-cols-2 gap-8 justify-items-stretch place-content-center place-items-center">
            <p className="text-3xl text-white justify-self-center">
              Pick a call name.
            </p>
            <label
              className="block mb-2 text-sm font-bold leading-5 text-white"
              htmlFor="username"
            >
              Call Name
              <div className="grid gap-4 grid-col-2 justify-items-end">
                <input
                  className="w-full px-3 py-2 border rounded shadow appearance-none text-grey-darker"
                  id="title"
                  type="title"
                  required
                  value={callName}
                  onChange={(e) => {
                    setCallName(e.target.value);
                  }}
                />
                <button className="p-2 text-white bg-purple-900 rounded">
                  Go To My Call
                </button>
              </div>
            </label>
          </div>
        </div> */}
        <div className="h-full px-4 pt-5 pb-4 bg-purple-300 bg-gradient-to-r sm:p-6 sm:pb-4 rounded-xl">
          <div className="grid h-full grid-cols-1 gap-8 justify-items-stretch place-content-center place-items-center">
            <p className="text-3xl text-white justify-self-center">
              So how does this work?
            </p>
            <p className="text-xl text-white justify-self-center">
              We are leveraging built in WebRTC so that you can connect with
              another person. It is basically like a tunnel through your browser
              to someone else.
            </p>
            <div className="grid h-full grid-cols-3 gap-2 justify-items-stretch place-content-center place-items-center">
              <AJAlt className="h-48" />
              <div className="grid grid-rows-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-20 h-20 text-gray-600 place-self-start"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 3h5m0 0v5m0-5l-6 6M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-20 h-20 text-pink-300 place-self-end"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                  />
                </svg>
              </div>
              <KCAlt className="h-48" />
            </div>
            <div className="grid grid-col-1 place-items-center">
              <button className="btn-primary">Start a Call</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
