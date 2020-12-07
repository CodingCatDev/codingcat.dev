import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { Post } from '@/models/post.model';
function RecentPostsCards({ recentPosts }) {
  return (
    <>
      {recentPosts.map((post: Post) => (
        <div className="p-3 m-3 bg-white rounded shadow " key={post.basename}>
          <div>
            <Link href={post.permalink}>
              <a>
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  width={post.type === 'podcasts' ? 200 : 480}
                  height={post.type === 'podcasts' ? 200 : 270}
                  layout="responsive"
                  className="rounded cursor-pointer"
                />
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
}
RecentPostsCards.propTypes = {
  recentPosts: PropTypes.array.isRequired,
};

export default RecentPostsCards;
