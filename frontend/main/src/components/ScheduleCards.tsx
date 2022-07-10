import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/models/post.model';

export default function ScheduleCards({
  posts,
}: {
  posts: Post[];
}): JSX.Element {
  console.log(posts);
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
                <a
                  href="https://twitch.tv/codingcatdev"
                  target="blank"
                  rel="noopener noreferrer"
                >
                  <>
                    <Image
                      src={`${post?.coverPhoto?.public_id}`}
                      alt={`Purrfect.dev hosted by Alex & Brittney with ${
                        post?.guests && post?.guests?.length > 1
                          ? 'guests'
                          : 'guest'
                      } ${post?.guests?.map((guest) => guest.name)}`}
                      width="480"
                      height="270"
                      layout="responsive"
                    />
                    {/* Individual guest images */}
                    {/* <div className="flex gap-2">
                      {post?.guests?.map((guest) => {
                        return (
                          <div className="w-20 h-20" key={guest.id}>
                            <Image
                              src={`/main-codingcatdev-photo/podcast-guest/${guest.twitter?.replace(
                                'https://twitter.com/',
                                ''
                              )}`}
                              alt={guest.name}
                              width="50"
                              height="50"
                              layout="responsive"
                              className="w-20 h-20 rounded-full cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div> */}
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
                  </>
                </a>
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
