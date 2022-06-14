import { Post, PostType } from '@/models/post.model';
import { isActiveLink } from '@/utils/basics/links';
import Link from 'next/link';
import { NextRouter } from 'next/router';

export default function RecentPostsList({
  posts,
  router,
}: {
  posts: Post[];
  router: NextRouter;
}): JSX.Element {
  function link(post: Post) {
    switch (post._type) {
      case PostType.course:
        return (
          <>
            <Link href={`/course/${post.slug}`}>
              <a
                className={`no-underline border-none text-basics-900 hover:underline flex p-1 rounded-md
                            ${
                              isActiveLink(router, `/course/${post.slug}`)
                                ? 'bg-primary-200 text-basics-50'
                                : 'bg-transparent text-basics-900'
                            }
                            `}
              >
                {post.title}
              </a>
            </Link>
          </>
        );
      default:
        return (
          <Link href={`/${post._type}/${post.slug}`}>
            <a
              className={`no-underline border-none hover:text-primary-900 hover:underline flex p-1 rounded-md
                            ${
                              isActiveLink(
                                router,
                                `/${post._type}/${post.slug}`
                              )
                                ? 'bg-primary-200 text-basics-50'
                                : 'bg-transparent text-basics-900'
                            }
                            `}
            >
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
