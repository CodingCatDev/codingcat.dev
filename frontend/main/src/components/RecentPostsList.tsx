import { Post, PostType } from '@/models/post.model';
import Link from 'next/link';

export default function RecentPostsList({
  posts,
}: {
  posts: Post[];
}): JSX.Element {
  function link(post: Post) {
    switch (post._type) {
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
          <Link href={`/${post._type}/${post.slug}`}>
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
        <li key={post._id} className="ml-0 list-none">
          {link(post)}
        </li>
      ))}
    </>
  );
}
