export default function ProfileProFeatures(): JSX.Element {
  return (
    <section>
      <div className="w-full p-8 text-2xl font-bold tracking-wide text-center uppercase border-b ">
        Why Join CodingCat.dev?
      </div>
      <div className="flex justify-center m-3">
        <ul>
          <li className="flex items-center">
            <div className="p-3 rounded-full fill-current bg-primary-100 text-primary-900">
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M0 10a10 10 0 1 1 20 0 10 10 0 0 1-20 0zm16.32-4.9L5.09 16.31A8 8 0 0 0 16.32 5.09zm-1.41-1.42A8 8 0 0 0 3.68 14.91L14.91 3.68z" />
              </svg>
            </div>
            <div className="flex flex-col flex-wrap">
              <span className="ml-3 text-xl font-bold ">
                Ad Free Experience
              </span>
              <span className="max-w-sm ml-3 text-md">
                Enjoy CodingCat.dev Tutorial website 100% without ads.
              </span>
              <span className="max-w-sm ml-3 text-md">
                No referral links and no advertisements.
              </span>
            </div>
          </li>
          <li className="flex items-center mt-3">
            <div className="p-3 rounded-full fill-current bg-primary-100 text-primary-900">
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M4 8V6a6 6 0 1 1 12 0h-3v2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8c0-1.1.9-2 2-2h1zm5 6.73V17h2v-2.27a2 2 0 1 0-2 0zM7 6v2h6V6a3 3 0 0 0-6 0z" />
              </svg>
            </div>
            <div className="flex flex-col flex-wrap">
              <span className="ml-3 text-xl font-bold ">Full Access</span>
              <span className="max-w-sm ml-3 text-md">
                Access the full CodingCat.dev Tutorial catalog and enjoy new
                premium tutorial series every single month.
              </span>
            </div>
          </li>
          <li className="flex items-center mt-3">
            <div className="p-3 rounded-full fill-current bg-primary-100 text-primary-900">
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M0 2C0 .9.9 0 2 0h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm14 12h4V2H2v12h4c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2zM9 8V5h2v3h3l-4 4-4-4h3z" />
              </svg>
            </div>
            <div className="flex flex-col flex-wrap">
              <span className="ml-3 text-xl font-bold ">
                Free Series Video Download
              </span>
              <span className="max-w-sm ml-3 text-md">
                Full zip file of entire pro series.
              </span>
            </div>
          </li>
          <li className="flex items-center mt-3">
            <div className="p-3 rounded-full fill-current bg-primary-100 text-primary-900">
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M11 0h1v3l3 7v8a2 2 0 0 1-2 2H5c-1.1 0-2.31-.84-2.7-1.88L0 12v-2a2 2 0 0 1 2-2h7V2a2 2 0 0 1 2-2zm6 10h3v10h-3V10z" />
              </svg>
            </div>
            <div className="flex flex-col flex-wrap">
              <span className="ml-3 text-xl font-bold ">Like and Bookmark</span>
              <span className="max-w-sm ml-3 text-md">
                Allows for better feedback, and you can see what courses work
                better for you!
              </span>
            </div>
          </li>
          <li className="flex items-center mt-3">
            <div className="p-3 rounded-full fill-current bg-primary-100 text-primary-900">
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M6 4H5a1 1 0 1 1 0-2h11V1a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V5a1 1 0 0 0-1-1h-7v8l-2-2-2 2V4z" />
              </svg>
            </div>
            <div className="flex flex-col flex-wrap">
              <span className="ml-3 text-xl font-bold ">Track Progress</span>
              <span className="max-w-sm ml-3 text-md">
                Some of the courses are very detailed, tracking allows you to
                remember where you left off.
              </span>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
