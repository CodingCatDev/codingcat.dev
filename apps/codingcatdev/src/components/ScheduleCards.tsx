import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/models/post.model';

export default function ScheduleCards({
  posts,
}: {
  posts: Post[];
}): JSX.Element {
  let re = /(\w+).null - /;

  return (
    <>
      {posts && posts.length > 0 ? (
        <section className="relative grid grid-cols-1 gap-4 lg:grid-cols-2">
          {posts.map((post) => {
            return (
              <div
                className="grid gap-2 p-4 transition-all rounded-md shadow-lg cursor-pointer dark:text-primary-50 dark:bg-basics-600 hover:shadow-2xl hover:scale-105 bg-basics-50"
                key={post._id}
              >
                <Link href={`/schedule/${post.slug}`}>
                  <Image
                    src={`${post?.coverPhoto?.public_id}`}
                    alt={`CodingCat.dev Podcast hosted by Alex & Brittney with ${
                      post?.guests && post?.guests?.length > 1
                        ? 'guests'
                        : 'guest'
                    } ${post?.guests?.map((guest) => guest.name)}`}
                    width="480"
                    height="270"
                    sizes="100vw"
                    style={{
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                  <div className="flex flex-col gap-1">
                    <time
                      dateTime={
                        post?.recordingDate
                          ? new Date(post.recordingDate).toLocaleString()
                          : ''
                      }
                      className="text-lg border-b-2 card-title border-b-primary-500"
                    >
                      {post?.recordingDate
                        ? new Date(post.recordingDate).toLocaleString()
                        : ''}
                    </time>
                    <h2 className="font-sans bold lg:text-2xl">
                      {post?.title?.replace(re, '')}
                    </h2>
                    <p className="text-lg font-thin">{post?.excerpt}</p>
                  </div>
                </Link>
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
