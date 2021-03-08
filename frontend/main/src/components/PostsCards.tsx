import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/models/post.model';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function PostsCards({ posts }: { posts: Post[] }): JSX.Element {
  return (
    <>
      {posts && posts.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 p-4 mx-auto sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-10 sm:p-10">
          {posts.map((post) => {
            return (
              <div className="rounded-md shadow bg-basics-50" key={post.id}>
                <Link href={`/${post.type}/${post.slug}`}>
                  <a>
                    {post.coverPhoto?.path ? (
                      <>
                        <Image
                          src={post.coverPhoto?.path}
                          alt={post.title}
                          width="480"
                          height="270"
                          layout="responsive"
                          className="rounded-md rounded-b-none cursor-pointer"
                        />
                      </>
                    ) : (
                      <div
                        className="relative"
                        style={{ paddingBottom: '56.25%' }}
                      >
                        <div className="absolute flex items-center flex-auto w-full h-full rounded-t-md bg-primary-900 dark:bg-primary-900">
                          <AJPrimary className="w-full h-full p-4" />
                        </div>
                      </div>
                    )}
                  </a>
                </Link>

                <section className="p-4 space-y-2" key={post.id}>
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
