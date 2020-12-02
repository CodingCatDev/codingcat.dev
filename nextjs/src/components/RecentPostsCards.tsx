import Link from 'next/link';
import Image from 'next/image';
import PropTypes from 'prop-types';

function RecentPostsCards({ recentPosts }) {
  return (
    <>
      {recentPosts.tutorials.map((post) => (
        <div
          className="bg-white shadow p-3 m-3 rounded"
          key={post.post_basename}
        >
          <div>
            <Link href={post.post_permalink}>
              <a>
                <Image
                  src={post.post_thumbnail}
                  alt={post.post_title}
                  width="480"
                  height="270"
                  layout="responsive"
                  className="rounded cursor-pointer"
                />
              </a>
            </Link>
          </div>
          <div className="mt-6">
            <p className="text-lg text-bold tracking-wide text-ccd-basics-600 mb-2">
              {post.post_title}
            </p>
            <p className="text-sm text-ccd-basics-600 font-hairline">
              {post.post_excerpt}
            </p>
          </div>
        </div>
      ))}
      {recentPosts.post.map((post) => (
        <div
          className="bg-white shadow p-3 m-3 rounded"
          key={post.post_basename}
        >
          <div>
            <Link href={post.post_permalink}>
              <a>
                <Image
                  src={post.post_thumbnail}
                  alt={post.post_title}
                  width="480"
                  height="270"
                  layout="responsive"
                  className="rounded cursor-pointer"
                />
              </a>
            </Link>
          </div>
          <div className="mt-6">
            <p className="text-lg text-bold tracking-wide text-ccd-basics-600 mb-2">
              {post.post_title}
            </p>
            <p className="text-sm text-ccd-basics-600 font-hairline">
              {post.post_excerpt}
            </p>
          </div>
        </div>
      ))}
      {recentPosts.podcasts.map((post) => (
        <div
          className="bg-white shadow p-3 m-3 rounded"
          key={post.post_basename}
        >
          <div>
            <Link href={post.post_permalink}>
              <a>
                <Image
                  src={post.post_thumbnail}
                  alt={post.post_title}
                  width="200"
                  height="200"
                  layout="responsive"
                  className="rounded cursor-pointer"
                />
              </a>
            </Link>
          </div>
          <div className="mt-6">
            <p className="text-lg text-bold tracking-wide text-ccd-basics-600 mb-2">
              {post.post_title}
            </p>
            <p className="text-sm text-ccd-basics-600 font-hairline">
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
