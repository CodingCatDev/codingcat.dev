export const AppMenu = (props) => {
  return (
    <div className="flex flex-col h-0 flex-1 w-full bg-ccd-primary-700">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav
          className="flex-1 px-2 bg-ccd-primary-800 space-y-1"
          aria-label="Sidebar"
        >
          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium text-white rounded-md bg-ccd-primary-900"
          >
            <svg
              className="mr-3 h-6 w-6 text-gray-300 group-hover:text-gray-300"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </a>

          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-ccd-primary-700"
          >
            <svg
              className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Team
            <span className="ml-auto inline-block py-0.5 px-3 text-xs font-medium rounded-full bg-ccd-primary-900 group-hover:bg-ccd-primary-800">
              3
            </span>
          </a>

          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-ccd-primary-700"
          >
            <svg
              className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
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
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            Projects
            <span className="ml-auto inline-block py-0.5 px-3 text-xs font-medium rounded-full bg-ccd-primary-900 group-hover:bg-ccd-primary-800">
              4
            </span>
          </a>

          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-ccd-primary-700"
          >
            <svg
              className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Calendar
          </a>

          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-ccd-primary-700"
          >
            <svg
              className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            Documents
          </a>

          <a
            href="#"
            className="group flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-ccd-primary-700"
          >
            <svg
              className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Reports
            <span className="ml-auto inline-block py-0.5 px-3 text-xs font-medium rounded-full bg-ccd-primary-900 group-hover:bg-ccd-primary-800">
              12
            </span>
          </a>
        </nav>
      </div>
      <div className="flex-shrink-0 flex bg-ccd-primary-700 p-4">
        <a href="#" className="flex-shrink-0 w-full group block">
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Tom Cook</p>
              <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                View profile
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
