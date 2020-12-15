import { Post } from '@/models/post.model';
import Link from 'next/link';

import PropTypes from 'prop-types';

export default function RecentPostsList({ posts }: { posts: Post[] }) {
  return (
    <>
      {posts.map((post) => (
        <div key={post.basename}>
          <Link href={post.permalink}>
            <a className="links-primary">{post.title}</a>
          </Link>
        </div>
      ))}
    </>
  );
}
