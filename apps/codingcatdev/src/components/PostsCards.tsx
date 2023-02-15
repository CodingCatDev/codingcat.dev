import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/models/post.model';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function PostsCards({ posts }: { posts: Post[] }): JSX.Element {
  return (
    <>
      {posts && posts.length > 0 ? (
        <section className="relative grid gap-4 grid-cols-fit sm:gap-10">
          {posts.map((post) => {
            return (
              <div
                className="grid transition-all rounded-md shadow-lg dark:text-primary-50 dark:bg-basics-900 grid-rows-auto-2 hover:shadow-2xl hover:scale-105 bg-basics-50"
                key={post._id}
              >
                <Link
                  href={`/${post._type}/${post.slug}`}
                  className="self-start"
                >
                  {post.coverPhoto?.secure_url && post._type === 'course' ? (
                    <>
                      <Image
                        src={post.coverPhoto?.secure_url}
                        alt={post.title}
                        width="480"
                        height="270"
                        className="rounded-md rounded-b-none cursor-pointer"
                        sizes="100vw"
                        style={{
                          width: '100%',
                          height: 'auto',
                        }}
                      />
                    </>
                  ) : post.coverPhoto?.secure_url ? (
                    <>
                      <Image
                        src={post.coverPhoto?.secure_url}
                        alt={post.title}
                        width="480"
                        height="270"
                        className="rounded-md rounded-b-none cursor-pointer"
                        sizes="100vw"
                        style={{
                          width: '100%',
                          height: 'auto',
                        }}
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
                </Link>

                <section className="grid h-full grid-cols-1 gap-2 p-4">
                  <div className="space-y-2">
                    <h3 className="font-sans text-lg tracking-wide text-bold">
                      <Link href={`/${post._type}/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm font-hairline ">{post.excerpt}</p>
                    )}
                    <div className="flex flex-col">
                      {post.authors?.map((author, i) => (
                        <Link
                          href={`/authors/${author.slug}`}
                          key={i}
                          className="font-sans text-lg"
                        >
                          {author.displayName}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="grid self-end justify-start grid-cols-2 gap-2 font-bold tracking-wider">
                    {post._type === 'course' && (
                      <>
                        {post?.access_mode === 'closed' ? (
                          <>
                            <p className="px-4 py-2 text-sm rounded-full justify-self-start bg-primary-900 dark:bg-primary-900 text-basics-50">
                              Member Only
                            </p>
                          </>
                        ) : post?.access_mode === 'free' ? (
                          <p className="px-4 py-2 text-sm font-bold tracking-wider rounded-full justify-self-start bg-primary-50 dark:bg-primary-50 text-primary-900 dark:text-primary-900">
                            Free
                          </p>
                        ) : (
                          <p className="px-4 py-2 text-sm font-bold tracking-wider rounded-full justify-self-start bg-secondary-600 text-basics-50">
                            Start now
                          </p>
                        )}
                      </>
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
