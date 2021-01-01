import Link from 'next/link';
import Image from 'next/image';
import { Post, PostType } from '@/models/post.model';

export default function PostsCards({
  posts,
  type,
}: {
  posts: Post[];
  type?: PostType;
}) {
  return (
    <>
      {posts && posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <div
              className="p-3 m-3 rounded shadow bg-basics-050"
              key={post.slug}
            >
              <div>
                <Link href={post.permalink}>
                  <a>
                    {post.thumbnail ? (
                      <>
                        {type === PostType.podcast ? (
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            width="150"
                            height="150"
                            layout="responsive"
                            className="rounded"
                          />
                        ) : (
                          <Image
                            src={post.thumbnail}
                            alt={post.title}
                            width="480"
                            height="270"
                            layout="responsive"
                            className="rounded"
                          />
                        )}
                      </>
                    ) : (
                      <div>Image Placeholder</div>
                    )}
                  </a>
                </Link>
              </div>
              <div className="mt-6">
                <p className="mb-2 text-lg tracking-wide text-basics-600 text-bold">
                  <Link href={post.permalink}>
                    <a>{post.title}</a>
                  </Link>
                </p>
                <p className="text-sm font-hairline text-basics-600">
                  {post.excerpt}
                </p>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <div className="p-3 m-3 bg-white rounded shadow col-span-full">
            Nothing to Show Just yet
          </div>
        </>
      )}
    </>
  );
}
