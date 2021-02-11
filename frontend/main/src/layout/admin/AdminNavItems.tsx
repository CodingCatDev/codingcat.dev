// import Link from 'next/link';
import Link from 'next/link';
import Courses from '@/components/global/icons/nav/Courses';
import Lessons from '@/components/global/icons/nav/Lessons';
import Tutorials from '@/components/global/icons/nav/Tutorials';
import Blog from '@/components/global/icons/nav/Blog';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Community from '@/components/global/icons/nav/Community';
import Pages from '@/components/global/icons/nav/Pages';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function AdminNavItems({ isNavOpen }): JSX.Element {
  if (isNavOpen) {
    return (
      <nav className="h-full p-4 text-xl bg-primary-900 dark:bg-primary-900">
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
        </ul>
      </nav>
    );
  } else {
    return (
      <nav className="h-full p-4 text-xl bg-primary-900 dark:bg-primary-900">
        <ul className="grid grid-cols-1 gap-4">
          <li>
            <Link href="/admin">
              <a className="flex items-center space-x-4 links-secondary">
                <AJPrimary className="block w-8 h-8" />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/course">
              <a className="flex items-center space-x-4 links-secondary">
                <Courses />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/lesson">
              <a className="flex items-center space-x-4 links-secondary">
                <Lessons />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/tutorial">
              <a className="flex items-center space-x-4 links-secondary">
                <Tutorials />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/post">
              <a className="flex items-center space-x-4 links-secondary">
                <Blog />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/podcast">
              <a className="flex items-center space-x-4 links-secondary">
                <Podcasts />
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/community">
              <a className="flex items-center space-x-4 links-secondary">
                <Community />
              </a>
            </Link>
          </li>
          <li>
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
