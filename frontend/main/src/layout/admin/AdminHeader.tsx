import Toggle from '@/components/global/icons/Toggle';

import { PostHeader } from '@/layout/admin/PostHeader';
import SearchModal from '@/components/algolia/SearchModal';
import { Post } from '@/models/post.model';
import { Site } from '@/models/site.model';

export const AdminHeader = ({
  site,
  post,
}: {
  site?: Site | null;
  post?: Post;
}): JSX.Element => {
  return (
    <header className="flex items-center justify-end w-full p-4">
      {/* Displays on EditPost Pages */}
      <PostHeader post={post} />
      <div className="flex items-center justify-end">
        <div className="flex items-center w-full space-x-2">
          <SearchModal />
          <button className="p-1 rounded-full text-basics-50 hover:bg-primary-700 dark:text-basics-50 dark:hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-basics-50">
            <span className="sr-only">View notifications</span>
            {/* Heroicon name: bell --> */}
            <svg
              className="w-8"
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <Toggle />
        </div>
      </div>
    </header>
  );
};
