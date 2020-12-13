import Link from 'next/link';

import Blog from '@/components/global/icons/nav/Blog';
import Community from '@/components/global/icons/nav/Community';
import Courses from '@/components/global/icons/nav/Courses';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Tutorials from '@/components/global/icons/nav/Tutorials';

export default function AdminMenu() {
  return (
    <>
      {/* Off-canvas menu for mobile, show/hide based on off-canvas menu state. */}
      <div className="md:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/*
Off-canvas menu overlay, show/hide based on off-canvas menu state.

Entering: "transition-opacity ease-linear duration-300"
From: "opacity-0"
To: "opacity-100"
Leaving: "transition-opacity ease-linear duration-300"
From: "opacity-100"
To: "opacity-0"
*/}
          <div className="fixed inset-0" aria-hidden="true">
            <div className="absolute inset-0 opacity-75 bg-ccd-basics-600" />
          </div>
          {/*
Off-canvas menu, show/hide based on off-canvas menu state.

Entering: "transition ease-in-out duration-300 transform"
From: "-translate-x-full"
To: "translate-x-0"
Leaving: "transition ease-in-out duration-300 transform"
From: "translate-x-0"
To: "-translate-x-full"
*/}
          <div className="relative flex flex-col flex-1 w-full max-w-xs pt-5 pb-4 bg-ccd-basics-800">
            <div className="absolute top-0 right-0 pt-2 -mr-12">
              <button className="flex items-center justify-center w-10 h-10 ml-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Close sidebar</span>
                {/* Heroicon name: x */}
                <svg
                  className="w-6 h-6 text-white"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center flex-shrink-0 px-4">
              <img
                className="w-auto h-8"
                src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                alt="Workflow"
              />
            </div>
            <div className="flex-1 h-0 mt-5 overflow-y-auto">
              <nav className="px-2 space-y-1">
                <a
                  href="#"
                  className="flex items-center px-2 py-2 text-base font-medium text-white rounded-md group bg-ccd-basics-900"
                >
                  {/* Heroicon name: home */}
                  <svg
                    className="w-6 h-6 mr-4 text-ccd-basics-300"
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
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </a>
                <a
                  href="#"
                  className="flex items-center px-2 py-2 text-base font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700"
                >
                  {/* Heroicon name: users */}
                  <svg
                    className="w-6 h-6 mr-4 text-ccd-basics-400 group-hover:text-ccd-basics-300"
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Team
                </a>
                <a
                  href="#"
                  className="flex items-center px-2 py-2 text-base font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700"
                >
                  {/* Heroicon name: folder */}
                  <svg
                    className="w-6 h-6 mr-4 text-ccd-basics-400 group-hover:text-ccd-basics-300"
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
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    />
                  </svg>
                  Projects
                </a>
                <a
                  href="#"
                  className="flex items-center px-2 py-2 text-base font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700"
                >
                  {/* Heroicon name: calendar */}
                  <svg
                    className="w-6 h-6 mr-4 text-ccd-basics-400 group-hover:text-ccd-basics-300"
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Calendar
                </a>
                <a
                  href="#"
                  className="flex items-center px-2 py-2 text-base font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700"
                >
                  {/* Heroicon name: inbox */}
                  <svg
                    className="w-6 h-6 mr-4 text-ccd-basics-400 group-hover:text-ccd-basics-300"
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
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  Documents
                </a>
                <a
                  href="#"
                  className="flex items-center px-2 py-2 text-base font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700"
                >
                  {/* Heroicon name: chart-bar */}
                  <svg
                    className="w-6 h-6 mr-4 text-ccd-basics-400 group-hover:text-ccd-basics-300"
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Reports
                </a>
              </nav>
            </div>
          </div>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </div>
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-1 h-0 ">
            <div className="flex items-center flex-shrink-0 h-16 px-4 text-white bg-ccd-basics-900">
              <Link href="/">
                <a>
                  <div className="text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700">
                    Main site
                  </div>
                </a>
              </Link>
            </div>
            <div className="flex items-center flex-shrink-0 h-16 px-4 text-white bg-ccd-basics-900">
              <Link href="/admin">
                <a>
                  <div className="text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700">
                    Dashboard
                  </div>
                </a>
              </Link>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1 bg-ccd-basics-800">
                <Link href="/admin/courses">
                  <a className="flex items-center px-2 py-2 text-sm font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700">
                    <div className="flex flex-col w-6 h-6 h-full mr-3 text-ccd-basics-400 group-hover:text-ccd-basics-300 justify-content">
                      <Courses />
                    </div>
                    Courses
                  </a>
                </Link>
                <Link href="/admin/tutorials">
                  <a className="flex items-center px-2 py-2 text-sm font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700">
                    <div className="flex flex-col w-6 h-6 h-full mr-3 text-ccd-basics-400 group-hover:text-ccd-basics-300 justify-content">
                      <Tutorials />
                    </div>
                    Tutorials
                  </a>
                </Link>
                <Link href="/admin/blog">
                  <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group hover:bg-ccd-basics-700">
                    <div className="flex flex-col w-6 h-6 h-full mr-3 text-ccd-basics-400 group-hover:text-ccd-basics-300 justify-content ">
                      <Blog />
                    </div>
                    Blog
                  </a>
                </Link>
                <Link href="/admin/podcasts">
                  <a className="flex items-center px-2 py-2 text-sm font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700">
                    <div className="flex flex-col w-6 h-6 h-full mr-3 text-ccd-basics-400 group-hover:text-ccd-basics-300 justify-content">
                      <Podcasts />
                    </div>
                    Podcasts
                  </a>
                </Link>
                <Link href="/admin/community">
                  <a className="flex items-center px-2 py-2 text-sm font-medium rounded-md group text-ccd-basics-300 hover:text-white hover:bg-ccd-basics-700">
                    <div className="flex flex-col w-6 h-6 h-full mr-3 text-ccd-basics-400 group-hover:text-ccd-basics-300 justify-content">
                      <Community />
                    </div>
                    Community
                  </a>
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
