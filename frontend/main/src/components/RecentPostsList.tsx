import { Post } from '@/models/post.model';
import Link from 'next/link';

import PropTypes from 'prop-types';

export default function RecentPostsList({ posts }: { posts: Post[] }) {
  return (
    <>
      {posts.map((post) => (
        <div className="mt-6" key={post.slug}>
          <Link href={`/${post.type}/${post.slug}`}>
            <a className="links-primary">{post.title}</a>
          </Link>
        </div>
      ))}
    </>
  );
}
