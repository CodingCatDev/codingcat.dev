import ActiveLink from '@/components/ActiveLink';
import TitleLogo from '@/components/global/logos/TitleLogo';

export const AppMenu = (props) => {
  const { setOverlayMenuActive, overlayMenuActive } = props;

  return (
    <div className="flex flex-col flex-1 w-full h-0 bg-ccd-purples-700">
      <div className="flex flex-col flex-1 pb-4 overflow-y-auto">
        <div className="flex items-center justify-between h-16 mx-4">
          <div className="flex items-center flex-shrink-0">
            <ActiveLink href="/">
              <a>
                <TitleLogo ajFaceStandard={false} />
              </a>
            </ActiveLink>
          </div>

          <button
            className="inline-flex items-center justify-center p-2 text-xl text-white rounded-md hover:text-white hover:bg-ccd-purples-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-expanded="false"
            onClick={() => setOverlayMenuActive(!overlayMenuActive)}
          >
            <span className="sr-only">Open main menu</span>
            {!overlayMenuActive ? (
              <svg
                className="block w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        <nav
          className="flex-1 px-2 space-y-1 bg-ccd-purples-800"
          aria-label="Sidebar"
        >
          <ActiveLink activeClassName="bg-ccd-purples-900" href="/courses">
            <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-ccd-purples-800 ">
              Courses
            </a>
          </ActiveLink>
          <ActiveLink activeClassName="bg-ccd-purples-900" href="/tutorials">
            <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-ccd-purples-800 ">
              Tutorials
            </a>
          </ActiveLink>
          <ActiveLink activeClassName="bg-ccd-purples-900" href="/blog">
            <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-ccd-purples-800 ">
              Blog
            </a>
          </ActiveLink>
          <ActiveLink activeClassName="bg-ccd-purples-900" href="/podcasts">
            <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-ccd-purples-800 ">
              Podcasts
            </a>
          </ActiveLink>
          <ActiveLink activeClassName="bg-ccd-purples-900" href="/community">
            <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group bg-ccd-purples-800 ">
              Community
            </a>
          </ActiveLink>
        </nav>
      </div>
      <div className="flex flex-shrink-0 p-4 bg-ccd-purples-700">
        <a href="#" className="flex-shrink-0 block w-full group">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block rounded-full h-9 w-9"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Tom Cook</p>
              <p className="text-xs font-medium text-ccd-basics-300 group-hover:text-ccd-basics-200">
                View profile
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
