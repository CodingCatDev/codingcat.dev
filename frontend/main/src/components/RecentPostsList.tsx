import { Post, PostType } from '@/models/post.model';
import { NextRouter } from 'next/router';
import ActiveLink from '@/components/ActiveLink';
import { isActiveLesson, isActiveLink } from '@/utils/basics/links';

export default function RecentPostsList({
  posts,
  router,
}: {
  posts: Post[];
  router: NextRouter;
}): JSX.Element {
  return (
    <>
      {posts.map((post) => (
        <li
          key={post._id}
          className={`list-none cursor-pointer p-1 rounded m-1 flex flex-col justify-between
        ${
          isActiveLink(router, `/${post._type}/${post.slug}`)
            ? 'bg-primary-900 text-basics-50'
            : 'bg-transparent hover:bg-primary-900 hover:text-basics-50'
        }
        `}
        >
          <ActiveLink
            href={
              PostType.course
                ? `/course/${post.slug}`
                : `/${post._type}/${post.slug}`
            }
          >
            <a className="no-underline border-none hover:text-basics-50 dark:hover:text-basics-50">
              {post.title}
            </a>
          </ActiveLink>
        </li>
      ))}
    </>
  );
}
