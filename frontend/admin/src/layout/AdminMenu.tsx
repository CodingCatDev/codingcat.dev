import { useState } from 'react';

import Link from 'next/link';

import Blog from '@/components/global/icons/nav/Blog';
import Community from '@/components/global/icons/nav/Community';
import Courses from '@/components/global/icons/nav/Courses';
import Lessons from '@/components/global/icons/nav/Lessons';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Tutorials from '@/components/global/icons/nav/Tutorials';

import AvatarMenu from '@/components/User/AvatarMenu';
import OutsideClick from '@/components/OutsideClick';

export default function AdminMenu() {
  const [userMenu, setUserMenu] = useState(false);

  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden h-full text-gray-300 bg-gray-800 md:block">
        <div className="flex items-center flex-shrink-0 h-16 px-4">
          <Link href="/">
            <a>
              <div className="text-white rounded-md ">Dashboard</div>
            </a>
          </Link>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            <Link href="/admin/courses">
              <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group">
                <div className="mr-2">
                  <Courses />
                </div>
                Courses
              </a>
            </Link>
            <Link href="/admin/lessons">
              <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group">
                <div className="mr-2">
                  <Lessons />
                </div>
                Lessons
              </a>
            </Link>
            <Link href="/admin/tutorials">
              <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group ">
                <div className="mr-2">
                  <Tutorials />
                </div>
                Tutorials
              </a>
            </Link>
            <Link href="/admin/blog">
              <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group">
                <div className="mr-2">
                  <Blog />
                </div>
                Blog
              </a>
            </Link>
            <Link href="/admin/podcasts">
              <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group ">
                <div className="mr-2">
                  <Podcasts className="w-8 h-8" />
                </div>
                Podcasts
              </a>
            </Link>
            <Link href="/admin/community">
              <a className="flex items-center px-2 py-2 text-sm font-medium text-white rounded-md group ">
                <div className="mr-2">
                  <Community />
                </div>
                Community
              </a>
            </Link>
          </nav>
          <OutsideClick toggle={setUserMenu} value={false}>
            <AvatarMenu userMenu={userMenu} setUserMenu={setUserMenu} />
          </OutsideClick>
        </div>
      </div>
    </>
  );
}
