import Link from 'next/link';
import Image from 'next/image';
import { CodingCatBuilderContent } from '@/models/builder.model';
import AJPrimary from '@/components/global/icons/AJPrimary';

export default function PostsCards({
  posts,
}: {
  posts?: CodingCatBuilderContent[];
}): JSX.Element {
  return (
    <>
      {posts && posts.length > 0 ? (
        <section className="relative grid gap-4 my-4 sm:grid-cols-fit sm:gap-10">
          {posts.map((post) => {
            return (
              <div
                className="grid transition-all transform rounded-md shadow-lg grid-rows-auto-2 hover:shadow-2xl hover:scale-105 bg-basics-50"
                key={post?.id}
              >
                <Link href={post?.data?.url}>
                  <a className="self-start">
                    {post?.data?.page?.coverPhoto?.public_id ? (
                      <>
                        <Image
                          src={post?.data?.page?.coverPhoto?.public_id}
                          alt={post?.data?.page?.title}
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

                <section className="grid h-full grid-cols-1 gap-2 p-4">
                  <div className="space-y-2">
                    <h3 className="font-sans text-lg tracking-wide text-basics-900 text-bold">
                      <Link href={`${post?.data?.url}`}>
                        <a>{post?.data?.page?.title}</a>
                      </Link>
                    </h3>
                    {post?.data?.page?.excerpt && (
                      <p className="text-sm font-hairline text-basics-900">
                        {post?.data?.page?.excerpt}
                      </p>
                    )}
                    <div>
                      {post?.data?.page?.authors?.map((author, i) => (
                        <Link
                          href={`/authors${author?.author?.value?.data?.slug}`}
                          key={i}
                        >
                          <a className="font-sans text-lg">
                            {author?.author?.value?.data?.displayName}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="grid self-end justify-start grid-cols-2 gap-2 font-bold tracking-wider">
                    {post?.data?.accessSettings && (
                      <>
                        {post?.data?.accessSettings?.accessMode === 'closed' ? (
                          <>
                            <p className="px-4 py-2 text-sm rounded-full justify-self-start bg-primary-900 dark:bg-primary-900 text-basics-50 dark:text-basics-50">
                              Member
                            </p>
                            <p className="px-4 py-2 text-sm font-bold tracking-wider transform -skew-y-12 justify-self-end bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                              ${post?.data?.accessSettings?.price}
                            </p>
                          </>
                        ) : post?.data?.accessSettings?.accessMode ===
                          'free' ? (
                          <p className="px-4 py-2 text-sm font-bold tracking-wider rounded-full justify-self-start bg-primary-50 dark:bg-primary-50 text-primary-900 dark:text-primary-900">
                            Free
                          </p>
                        ) : (
                          <p className="px-4 py-2 text-sm font-bold tracking-wider rounded-full justify-self-start bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50">
                            Needs Login
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
