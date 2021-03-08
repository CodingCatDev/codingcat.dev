import Link from 'next/link';
import Image from 'next/image';
import AJPrimary from '@/components/global/icons/AJPrimary';
import { Post } from '@/models/post.model';

export function RecentPostsCards({
  recentPosts,
}: {
  recentPosts: Post[];
}): JSX.Element {
  return (
    <>
      {recentPosts.map((post: Post) => (
        <div
          className="transition-all transform rounded-md shadow-lg hover:shadow-2xl hover:scale-105 bg-basics-50"
          key={post.id}
        >
          <Link href={`/${post.type}/${post.slug}`}>
            <a className="flex flex-col h-full">
              {post.coverPhoto && post.coverPhoto.path ? (
                <>
                  <Image
                    src={post.coverPhoto.path}
                    alt={post.title}
                    width={480}
                    height={270}
                    layout="responsive"
                    className="cursor-pointer rounded-t-md"
                  />
                </>
              ) : (
                <div className="flex items-center flex-auto rounded-t-md bg-primary-900 dark:bg-primary-900">
                  <AJPrimary className="max-w-full p-4 mx-auto max-h-32 2xl:max-h-64" />
                </div>
              )}

              <div className="p-4 space-y-2">
                <h3 className="font-sans text-xl font-bold tracking-wide text-basics-900">
                  {post.title}
                </h3>
                <p className="lg:text-lg text-basics-900">{post.excerpt}</p>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </>
  );
}
