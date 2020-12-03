import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';
function RecentPostsCards({ recentPosts }) {
  return (
    <>
      {recentPosts.map((post) => (
        <div
          className="p-3 m-3 bg-white rounded shadow "
          key={post.post_basename}
        >
          <div>
            <Link href={post.post_permalink}>
              <a>
                <Image
                  src={post.post_thumbnail}
                  alt={post.post_title}
                  width={post.post_type === 'podcasts' ? 200 : 480}
                  height={post.post_type === 'podcasts' ? 200 : 270}
                  layout="responsive"
                  className="rounded cursor-pointer"
                />
              </a>
            </Link>
          </div>
          <div className="mt-6">
            <p className="mb-2 text-lg tracking-wide text-bold text-ccd-basics-600">
              {post.post_title}
            </p>
            <p className="text-sm font-hairline text-ccd-basics-600">
              {post.post_excerpt}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
RecentPostsCards.propTypes = {
  recentPosts: PropTypes.object.isRequired,
};

export default RecentPostsCards;
