import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/models/post.model';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function PostsCards({ posts }: { posts: Post[] }): JSX.Element {
  console.log(posts);
  return (
    <>
      {posts && posts.length > 0 ? (
        <section className="grid gap-4 p-4 grid-cols-fit sm:gap-10 sm:p-10">
          {posts.map((post) => {
            return (
              <div
                className="transition-all transform rounded-md shadow-lg hover:shadow-2xl hover:scale-105 bg-basics-50"
                key={post.id}
              >
                <Link href={`/${post.type}/${post.slug}`}>
                  <a>
                    {/* {post.type === 'course' ? (
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
                    )}  */}
                    {post.coverPhoto?.path && post.type === 'course' ? (
                      <div className="relative">
                        <Image
                          src={post.coverPhoto?.path}
                          alt={post.title}
                          width="480"
                          height="270"
                          layout="responsive"
                          className="rounded-md rounded-b-none cursor-pointer"
                        />
                        {post.accessSettings?.accessMode === 'closed' ? (
                          <div className="absolute grid gap-2 font-bold tracking-wider -bottom-12 -right-8 place-items-center">
                            <p className="px-4 py-2 font-bold tracking-wider transform -skew-y-12 bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50">
                              ${post.accessSettings?.price}
                            </p>
                            <p className="px-4 py-2 rounded-full bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                              Paid
                            </p>
                          </div>
                        ) : post.accessSettings?.accessMode === 'free' ? (
                          <p className="absolute px-4 py-2 font-bold tracking-wider rounded-full bg-secondary-600 dark:bg-secondary-600 -bottom-12 -right-8 text-basics-50 dark:text-basics-50">
                            Free
                          </p>
                        ) : (
                          <p className="absolute px-4 py-2 font-bold tracking-wider rounded-full bg-secondary-600 dark:bg-secondary-600 -bottom-12 -right-8 text-basics-50 dark:text-basics-50">
                            Start now
                          </p>
                        )}
                      </div>
                    ) : post.coverPhoto?.path ? (
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
                        {post.type === 'course' ? (
                          <p className="absolute px-4 py-2 rounded-full bg-secondary-600 dark:bg-secondary-600 -bottom-12 -right-8 text-basics-50 dark:text-basics-50">
                            Start now
                          </p>
                        ) : (
                          <></>
                        )}
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
