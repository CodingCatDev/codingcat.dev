import Link from 'next/link';
import Image from 'next/image';
import { Post, PostType } from '@/models/post.model';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function PostsCards({ posts }: { posts: Post[] }): JSX.Element {
  return (
    <>
      {posts && posts.length > 0 ? (
        <section className="grid gap-4 p-4 grid-cols-fit sm:gap-10 sm:p-10">
          {posts.map((post) => {
            return (
              <>
                <div
                  className="grid grid-cols-1 rounded-md shadow bg-basics-50"
                  key={post.id}
                >
                  <Link href={`/${post.type}/${post.slug}`}>
                    <a className="grid items-start grid-cols-1 grid-rows-auto-2">
                      {post.coverPhoto?.path ? (
                        <>
                          <Image
                            src={post.coverPhoto?.path}
                            alt={post.title}
                            width="1920"
                            height="1080"
                            layout="responsive"
                            className="cursor-pointer rounded-t-md"
                          />
                        </>
                      ) : (
                        <div className="flex items-center rounded-t-md bg-primary-900 dark:bg-primary-900">
                          <AJPrimary className="h-40 max-w-full p-4 mx-auto" />
                        </div>
                      )}
                    </a>
                  </Link>

                  <section className="p-4 space-y-2">
                    <h3 className="font-sans text-lg tracking-wide text-basics-900 text-bold">
                      <Link href={`/${post.type}/${post.slug}`}>
                        <a>{post.title}</a>
                      </Link>
                    </h3>
                    <p className="text-sm font-hairline text-basics-900">
                      {post.excerpt}
                    </p>
                  </section>
                </div>
              </>
            );
          })}
        </section>
      ) : (
        <>
          <div className="rounded-md shadow bg-basics-50">
            Nothing to Show Just yet
          </div>
        </>
      )}
    </>
  );
}
