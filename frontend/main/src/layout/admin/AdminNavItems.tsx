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

export default function AdminNavItems(): JSX.Element {
  return (
    <nav className="bg-basics-900">
      <ul>
        <li>
          <Link href="/admin">
            <a className="flex p-2">
              <AJPrimary className="block w-8 h-8" />
              <p className="ml-2 text-white">Dashboard</p>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/admin/course">
            <a className="flex p-2">
              <Courses />
              <p className="ml-2 text-white">Courses</p>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/admin/lesson">
            <a className="flex p-2">
              <Lessons />
              <p className="ml-2 text-white">Lessons</p>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/admin/tutorial">
            <a className="flex p-2">
              <Tutorials />
              <p className="ml-2 text-white">Tutorials</p>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/admin/post">
            <a className="flex p-2">
              <Blog />
              <p className="ml-2 text-white">Blog</p>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/admin/podcast">
            <a className="flex p-2">
              <Podcasts />
              <p className="ml-2 text-white">Podcasts</p>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/admin/community">
            <a className="flex p-2">
              <Community />
              <p className="ml-2 text-white">Community</p>
            </a>
          </Link>
        </li>
        <li>
          <Link href="/admin/page">
            <a className="flex p-2">
              <Pages />
              <p className="ml-2 text-white">Pages</p>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
