import { Post } from '@/models/post.model';
import Link from 'next/link';

import PropTypes from 'prop-types';

export default function RecentPostsList({ posts }: { posts: Post[] }) {
  return (
    <div>
      {posts.map((post) => (
        <div className="mt-6" key={post.basename}>
          <Link href={post.permalink}>
            <a>
              <p className="p-1 mb-1 tracking-wide rounded cursor-pointer text-md text-bold text-ccd-basics-600 hover:bg-ccd-purples-500 hover:text-white">
                {post.title}
              </p>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
