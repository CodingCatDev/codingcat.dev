import Link from 'next/link';
import Image from 'next/image';
import { Post, PostType } from '@/models/post.model';
import { ComponentType } from 'react';

export const RecentPostsCards: ComponentType<{ recentPosts: Post[] }> = (
  props
) => {
  const { recentPosts } = props;
  return (
    <>
      {recentPosts.map((post: Post) => (
        <div className="p-3 m-3 bg-white rounded shadow " key={post.slug}>
          <div>
            <Link href={post.permalink}>
              <a>
                {post.thumbnail ? (
                  <>
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      width={post.type === PostType.podcast ? 200 : 480}
                      height={post.type === PostType.podcast ? 200 : 270}
                      layout="responsive"
                      className="rounded cursor-pointer"
                    />
                  </>
                ) : (
                  <div>Image Placeholder</div>
                )}
              </a>
            </Link>
          </div>
          <div className="mt-6">
            <p className="mb-2 text-lg tracking-wide text-bold text-ccd-basics-600">
              {post.title}
            </p>
            <p className="text-sm font-hairline text-ccd-basics-600">
              {post.excerpt}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};
