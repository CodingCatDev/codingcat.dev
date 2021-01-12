import Link from 'next/link';
import Image from 'next/image';
import { Post, PostType } from '@/models/post.model';
import { ComponentType } from 'react';

export function RecentPostsCards({ recentPosts }: { recentPosts: Post[] }) {
  return (
    <>
      {recentPosts.map((post: Post) => (
        <div className="rounded-md shadow bg-basics-50" key={post.id}>
          <div>
            <Link href={`/${post.type}/${post.slug}`}>
              <a>
                {post.coverPhoto && post.coverPhoto.path ? (
                  <>
                    <Image
                      src={post.coverPhoto.path}
                      alt={post.title}
                      width={480}
                      height={270}
                      layout="responsive"
                      className="rounded-md rounded-b-none cursor-pointer"
                    />
                  </>
                ) : (
                  <div>Image Placeholder</div>
                )}
              </a>
            </Link>
          </div>
          <div className="p-4 space-y-2">
            <p className="text-lg tracking-wide text-basics-900 text-bold">
              {post.title}
            </p>
            <p className="text-sm font-hairline text-basics-900">
              {post.excerpt}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
