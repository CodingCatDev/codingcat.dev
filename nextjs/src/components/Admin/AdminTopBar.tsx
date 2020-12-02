export default function AdminTopBar({ router }) {
  return (
    <>
      <div className="relative flex-shrink-0 flex h-16 bg-white shadow">
        <button className="px-4 border-r border-ccd-basics-200 text-ccd-basics-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
          <span className="sr-only">Open sidebar</span>
          {/* Heroicon name: menu-alt-2 */}
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>
        <div className="flex-1 px-4 flex justify-between">
          <div className="flex-1 flex">
            <form className="w-full flex md:ml-0" action="#" method="GET">
              <label htmlFor="search_field" className="sr-only">
                Search
              </label>
              <div className="relative w-full text-ccd-basics-400 focus-within:text-ccd-basics-600">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  {/* Heroicon name: search */}
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search_field"
                  className="block w-full h-full pl-8 pr-3 py-2 border-transparent text-ccd-basics-900 placeholder-ccd-basics-500 focus:outline-none focus:placeholder-ccd-basics-400 focus:ring-0 focus:border-transparent sm:text-sm"
                  placeholder="Search"
                  type="search"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
