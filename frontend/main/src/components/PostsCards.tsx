import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/models/post.model';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function PostsCards({ posts }: { posts: Post[] }): JSX.Element {
  return (
    <>
      {posts && posts.length > 0 ? (
        <section className="grid items-start content-start gap-4 p-4 grid-cols-fit sm:gap-10 sm:p-10">
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
                  <div>
                    {post.authors?.map((author, i) => (
                      <h4 key={i} className="font-sans text-lg">
                        {author.displayName}
                      </h4>
                    ))}
                  </div>
                  <div className="relative grid justify-start gap-2 font-bold tracking-wider">
                    {post.accessSettings?.accessMode === 'closed' ? (
                      <>
                        <p className="px-4 py-2 text-sm rounded-full bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50">
                          Paid
                        </p>
                        <p className="absolute px-4 py-2 text-sm font-bold tracking-wider transform -skew-y-12 -right-8 top-4 bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                          ${post.accessSettings?.price}
                        </p>
                      </>
                    ) : post.accessSettings?.accessMode === 'free' ? (
                      <p className="px-4 py-2 text-sm font-bold tracking-wider rounded-full bg-primary-50 dark:bg-primary-50 text-primary-900 dark:text-primary-900">
                        Free
                      </p>
                    ) : (
                      <p className="px-4 py-2 text-sm font-bold tracking-wider rounded-full bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                        Start now
                      </p>
                    )}
                  </div>
                </section>
              </div>
            );
          })}
        </section>
      ) : (
        <>
          <div className="p-4 pt-8">
            <h1>Oh no! Nothing to show yet...</h1>
          </div>
        </>
      )}
    </>
  );
}
