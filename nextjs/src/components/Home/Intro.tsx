import { url } from 'inspector';
import dynamic from 'next/dynamic';

const UserSignin = dynamic(() => import('@/components/UserSignin'), {
  ssr: false,
  loading: () => (
    <>
      <div className="relative flex justify-center mb-48 h-96"></div>
      <div className="relative flex justify-center h-96"></div>
    </>
  ),
});

export default function Intro() {
  return (
    <>
      <div className="flex flex-row flex-wrap sm::max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl ">
        <div className="w-full px-2 pt-40 pb-40 md:w-1/2 sm:pl-16 md:pl-20 lg:pl-48">
          <UserSignin />
        </div>
        <div className="flex flex-wrap content-start justify-center w-full pt-16 lg:pl-8 lg:pr-16 lg:pl-48 lg:pt-48 lg:w-1/2">
          <div className="flex flex-col px-2 ml-8 bg-ccd-purples-050 align-content-start md:rounded-xl">
            <h3 className="p-4">
              <div className="vertical-text-clip">Purrfect</div>
              <div className="vertical-text-clip">Web Tutorials</div>
            </h3>
            <p className="p-4 text-xl text-ccd-purples-900">
              Get the skills you need to become a better web developer today.
              High quality courses with custom certificates and projects to show
              off your new skills.
            </p>
            <div className="flex items-center justify-between p-4">
              <button
                className="px-4 py-2 font-bold text-white rounded bg-ccd-purples-900 hover:bg-blue-dark"
                type="button"
              >
                Go Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
