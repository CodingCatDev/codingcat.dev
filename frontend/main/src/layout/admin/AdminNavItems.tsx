import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import Courses from '@/components/global/icons/nav/Courses';
import Lessons from '@/components/global/icons/nav/Lessons';
import Tutorials from '@/components/global/icons/nav/Tutorials';
import Blog from '@/components/global/icons/nav/Blog';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Community from '@/components/global/icons/nav/Community';
import Pages from '@/components/global/icons/nav/Pages';
import AJPrimary from '@/components/global/icons/AJPrimary';
import Site from '@/components/global/icons/nav/Site';

export default function AdminNavItems({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: Dispatch<SetStateAction<boolean>>;
}): JSX.Element {
  if (navOpen) {
    return (
      <nav className="relative grid items-start content-start h-full grid-cols-1 gap-2 p-4 text-xl bg-primary-900 dark:bg-primary-900">
        <button
          className="absolute top-0 right-0 p-2 text-xl rounded-full rounded-r-none bg-primary-600 text-basics-50 hover:text-basics-50 dark:text-basics-50 dark:hover:text-basics-50 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-basics-50"
          aria-expanded="true"
          onClick={() => setNavOpen(false)}
        >
          <span className="sr-only">Minimize navigation</span>
          <svg
            className="w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <ul className="grid grid-cols-1 gap-4">
          <li>
            <Link href="/admin">
              <a className="flex items-center space-x-4 links-secondary">
                <AJPrimary className="block w-8 h-8" />
                <p className="ml-2">Dashboard</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/course">
              <a className="flex items-center space-x-4 links-secondary">
                <Courses />
                <p className="ml-2">Courses</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/lesson">
              <a className="flex items-center space-x-4 links-secondary">
                <Lessons />
                <p className="ml-2">Lessons</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/tutorial">
              <a className="flex items-center space-x-4 links-secondary">
                <Tutorials />
                <p className="ml-2">Tutorials</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/post">
              <a className="flex items-center space-x-4 links-secondary">
                <Blog />
                <p className="ml-2">Blog</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/podcast">
              <a className="flex items-center space-x-4 links-secondary">
                <Podcasts />
                <p className="ml-2">Podcasts</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/community">
              <a className="flex items-center space-x-4 links-secondary">
                <Community />
                <p className="ml-2">Community</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/page">
              <a className="flex items-center space-x-4 links-secondary">
                <Pages />
                <p className="ml-2">Pages</p>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/site">
              <a className="flex items-center space-x-4 links-secondary">
                <Site />
                <p className="ml-2">Site</p>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className="grid grid-cols-1 gap-4 text-xl bg-primary-900 dark:bg-primary-900">
        <button
          className="p-2 text-xl rounded-full rounded-r-none justify-self-end bg-primary-600 text-basics-50 hover:text-basics-50 dark:text-basics-50 dark:hover:text-basics-50 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-basics-50"
          aria-expanded="false"
          onClick={() => setNavOpen(true)}
        >
          <span className="sr-only">Maximize navigation</span>
          <svg
            className="w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <ul className="grid content-center grid-cols-1 gap-4">
          <li className="grid justify-center w-full">
            <Link href="/admin">
              <a className="flex items-center space-x-4 links-secondary">
                <AJPrimary className="block w-8 h-8" />
              </a>
            </Link>
          </li>
          <li className="grid justify-center w-full">
            <Link href="/admin/course">
              <a className="flex items-center space-x-4 links-secondary">
                <Courses />
              </a>
            </Link>
          </li>
          <li className="grid justify-center w-full">
            <Link href="/admin/lesson">
              <a className="flex items-center space-x-4 links-secondary">
                <Lessons />
              </a>
            </Link>
          </li>
          <li className="grid justify-center w-full">
            <Link href="/admin/tutorial">
              <a className="flex items-center space-x-4 links-secondary">
                <Tutorials />
              </a>
            </Link>
          </li>
          <li className="grid justify-center w-full">
            <Link href="/admin/post">
              <a className="flex items-center space-x-4 links-secondary">
                <Blog />
              </a>
            </Link>
          </li>
          <li className="grid justify-center w-full">
            <Link href="/admin/podcast">
              <a className="flex items-center space-x-4 links-secondary">
                <Podcasts />
              </a>
            </Link>
          </li>
          <li className="grid justify-center w-full">
            <Link href="/admin/community">
              <a className="flex items-center space-x-4 links-secondary">
                <Community />
              </a>
            </Link>
          </li>
          <li className="grid justify-center w-full">
            <Link href="/admin/page">
              <a className="flex items-center space-x-4 links-secondary">
                <Pages />
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}
