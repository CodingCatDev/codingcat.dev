import { Post, PostType } from '@/models/post.model';
import { pluralize, toTitleCase } from '@/utils/basics/stringManipulation';
import Link from 'next/link';

import PropTypes from 'prop-types';

export default function RecentPostsList({
  posts,
}: {
  posts: Post[];
}): JSX.Element {
  function link(post: Post) {
    const pluralType = pluralize(post);

    switch (post.type) {
      case PostType.course:
        return (
          <>
            <Link href={`/course/${post.slug}`}>
              <a className="no-underline text-basics-900 hover:text-primary-900 hover:underline">
                {post.title}
              </a>
            </Link>
          </>
        );
      default:
        return (
          <Link href={`/${post.type}/${post.slug}`}>
            <a className="no-underline text-basics-900 hover:text-primary-900 hover:underline">
              {post.title}
            </a>
          </Link>
        );
    }
  }
  return (
    <>
      {posts.map((post) => (
        <li key={post.id} className="ml-0 list-none">
          {link(post)}
        </li>
      ))}
    </>
  );
}
